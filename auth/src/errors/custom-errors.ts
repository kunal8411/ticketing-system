export abstract class CustomError extends Error {
  // abstract means whichenver class imports this need to have this field
  abstract statusCode: number;
  constructor(error:string) {
    super(error);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  // {}[] means will return array of objects
  abstract serializeErrors(): { message: string; field?: string }[];
}
