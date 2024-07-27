import { ExpressValidator, ValidationError } from "express-validator";
import {CustomError} from './custom-errors'

export class RequestValidatorError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    // will not send this to FE, just for backend logs
    super('Error in the Request Validator');

    // because we are exporting built in class
    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      if (err.type === "field") {
        return { message: err.msg, field: err.path };
      }
      return { message: err.msg };
    });
  }
}
