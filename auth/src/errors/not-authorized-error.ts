import { CustomError } from "./custom-errors";

export class NotAuthirizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');
    Object.setPrototypeOf(this, NotAuthirizedError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Not Authorized' }];
  }
}
