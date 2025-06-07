if [[ ! $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "用法: $0 <版本号>（格式如 1.2.3）"
  exit 1
fi
cd web 
pnpm build
cd ..
docker build -t kasukabetsumugi/whisper-asr-spa:$1 .