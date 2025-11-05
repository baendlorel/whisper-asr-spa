import { div } from 'kt.js';
import { ProgressBar } from '../progress-bar';

export class TimerDialog {
  readonly el: HTMLDialogElement;
  private readonly content: HTMLDivElement;
  private readonly progressBar?: ProgressBar;
  private seconds: number = 0;
  private timerId: number | null = null;

  constructor(progressBar?: ProgressBar) {
    this.progressBar = progressBar;
    this.content = div({ class: 'timer-content' });

    this.el = document.createElement('dialog');
    this.el.className = 'timer-dialog';
    this.el.appendChild(this.content);

    // Add progress bar if provided
    if (this.progressBar) {
      this.el.appendChild(div('timer-progress-wrapper', [this.progressBar.el]));
    }

    // Prevent dialog from closing with ESC key
    this.el.addEventListener('cancel', (e) => {
      e.preventDefault();
    });

    // Prevent closing by clicking outside
    this.el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    document.body.appendChild(this.el);
  }

  start() {
    this.seconds = 0;
    this.updateContent();
    this.el.showModal();

    // Add opening animation class
    requestAnimationFrame(() => {
      this.el.classList.add('dialog-open');
    });

    // Start timer
    this.timerId = window.setInterval(() => {
      this.seconds++;
      this.updateContent();

      // Check if progress is complete
      if (this.progressBar && this.progressBar.value >= 1) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    // Clear timer
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    // Add closing animation class
    this.el.classList.remove('dialog-open');
    this.el.classList.add('dialog-close');

    // Close dialog after animation
    setTimeout(() => {
      this.el.close();
      this.el.classList.remove('dialog-close');
      this.destroy();
    }, 300); // Match CSS animation duration
  }

  private updateContent() {
    this.content.textContent = `Working.....${this.seconds} seconds passed`;
  }

  private destroy() {
    // Clean up timer
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    // Remove from DOM
    if (this.el.parentElement) {
      this.el.parentElement.removeChild(this.el);
    }
  }
}
