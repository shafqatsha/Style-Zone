export function handleError({ error, message, code, next }) {
  if (!error) error = new Error(message);
  error.statusCode = error.statusCode || code;
  if (next) return next(error);
  throw error;
}
