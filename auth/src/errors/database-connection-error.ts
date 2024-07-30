import { ExpressValidator, ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";
export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  error = "error connection to Database!";
  constructor() {
    // will not send this to FE, just for backend logs
    super("Error connection to Database!");

    // because we are exporting built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [
      {
        message: this.error,
      },
    ];
  }
}
