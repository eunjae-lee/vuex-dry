import { ErrorLogger } from "./logger";

class ErrorThrower {
  message: string;
  logger: ErrorLogger;

  constructor(message: string) {
    this.message = message;
    this.logger = new ErrorLogger();
    this.logger.add(message);
    this.logger.add("");
  }

  add(message: string) {
    this.logger.add(message);
    return this;
  }

  logAndThrow() {
    this.logger.print();
    throw new Error(this.message);
  }
}

export function errorThrower(message: string) {
  return new ErrorThrower(message);
}
