export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errors = {
  badRequest: (message = "Bad request", details?: unknown) =>
    new AppError(400, "bad_request", message, details),
  unauthorized: (message = "Unauthorized", details?: unknown) =>
    new AppError(401, "unauthorized", message, details),
  forbidden: (message = "Forbidden", details?: unknown) =>
    new AppError(403, "forbidden", message, details),
  notFound: (message = "Not found", details?: unknown) =>
    new AppError(404, "not_found", message, details),
  conflict: (message = "Conflict", details?: unknown) =>
    new AppError(409, "conflict", message, details),
  unprocessable: (message = "Unprocessable", details?: unknown) =>
    new AppError(422, "unprocessable", message, details),
};
