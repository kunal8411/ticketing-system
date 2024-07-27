import { CustomError } from "./custom-errors";

export class NotFoundError extends CustomError {
  statusCode = 500;

  constructor() {
    super("NOt found error");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeErrors() {
    return [{ message: "Not found error" }];
  }
}
