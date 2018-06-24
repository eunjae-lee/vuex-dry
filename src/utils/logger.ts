export class ErrorLogger {
  messages: Array<string> = [];

  constructor() {
    this.messages.push("[vuex-dry]");
  }

  add(message: string) {
    this.messages.push(`\t${message}`);
  }

  print() {
    console.error(this.messages.join("\n"));
  }
}
