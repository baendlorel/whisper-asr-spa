import os
from io import StringIO
from threading import Lock, Thread
from typing import BinaryIO, Union
import time
import gc

import torch
import whisper
from faster_whisper import WhisperModel

from .utils import ResultWriter, WriteJSON, WriteSRT, WriteTSV, WriteTXT, WriteVTT

model_name = os.getenv("ASR_MODEL", "base")
model_path = os.getenv("ASR_MODEL_PATH", os.path.join(os.path.expanduser("~"), ".cache", "whisper"))
model = None
model_lock = Lock()

# More about available quantization levels is here:
#   https://opennmt.net/CTranslate2/quantization.html

last_activity_time = time.time()
idle_timeout = int(os.getenv("IDLE_TIMEOUT", 300))  # default to 5 minutes

def monitor_idleness():
    global model
    while True:
        time.sleep(60)  # check every minute
        if time.time() - last_activity_time > idle_timeout:
            with model_lock:
                release_model()
                break

def load_model():
    global model, device, model_quantization

    if torch.cuda.is_available():
        device = "cuda"
        model_quantization = os.getenv("ASR_QUANTIZATION", "float32")
    else:
        device = "cpu"
        model_quantization = os.getenv("ASR_QUANTIZATION", "int8")
    
    model = WhisperModel(
        model_size_or_path=model_name, device=device, compute_type=model_quantization, download_root=model_path
    )

    Thread(target=monitor_idleness, daemon=True).start()

load_model()

def release_model():
    global model
    del model
    torch.cuda.empty_cache()
    gc.collect()
    model = None
    print("Model unloaded due to timeout")

def transcribe(
    audio,
    task: Union[str, None],
    language: Union[str, None],
    initial_prompt: Union[str, None],
    vad_filter: Union[bool, None],
    word_timestamps: Union[bool, None],
    output,
):
    global last_activity_time
    last_activity_time = time.time()

    with model_lock:
        if(model is None): load_model()

    options_dict = {"task": task}
    if language:
        options_dict["language"] = language
    if initial_prompt:
        options_dict["initial_prompt"] = initial_prompt
    if vad_filter:
        options_dict["vad_filter"] = True
    if word_timestamps:
        options_dict["word_timestamps"] = True
    with model_lock:
        segments = []
        text = ""
        segment_generator, info = model.transcribe(audio, beam_size=5, **options_dict)
        for segment in segment_generator:
            segments.append(segment)
            text = text + segment.text
        result = {"language": options_dict.get("language", info.language), "segments": segments, "text": text}

    output_file = StringIO()
    write_result(result, output_file, output)
    output_file.seek(0)

    return output_file


def language_detection(audio):
    global last_activity_time
    last_activity_time = time.time()

    with model_lock:
        if(model is None): load_model()

    # load audio and pad/trim it to fit 30 seconds
    audio = whisper.pad_or_trim(audio)

    # detect the spoken language
    with model_lock:
        segments, info = model.transcribe(audio, beam_size=5)
        detected_lang_code = info.language

    return detected_lang_code


def write_result(result: dict, file: BinaryIO, output: Union[str, None]):
    if output == "srt":
        WriteSRT(ResultWriter).write_result(result, file=file)
    elif output == "vtt":
        WriteVTT(ResultWriter).write_result(result, file=file)
    elif output == "tsv":
        WriteTSV(ResultWriter).write_result(result, file=file)
    elif output == "json":
        WriteJSON(ResultWriter).write_result(result, file=file)
    elif output == "txt":
        WriteTXT(ResultWriter).write_result(result, file=file)
    else:
        return "Please select an output method!"
