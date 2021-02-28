export class AppError implements Error {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly name: string;
  public readonly stack?: string;

  constructor(message: string, statusCode: number = 400) {
    this.name = "App Error";
    this.message = message;
    this.statusCode = statusCode;
  }
}
