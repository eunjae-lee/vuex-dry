let logMuted = false;

export function muteLog() {
  logMuted = true;
}

export class ErrorLogger {
  messages: Array<string> = [];

  constructor() {
    this.messages.push("[vuex-dry]");
  }

  add(message: string) {
    this.messages.push(`\t${message}`);
  }

  print() {
    if (logMuted) {
      return;
    }
    console.error(this.messages.join("\n"));
  }
}
