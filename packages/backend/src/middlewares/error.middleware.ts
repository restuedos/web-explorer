export const errorMiddleware = ({ code, error, set }: { code: any, error: any, set: any }) => {
  console.error('Error:', error);

  set.status =
    code === 'VALIDATION' ? 400 :
    code === 'NOT_FOUND' ? 404 : 500;

  let parsedError;
  try {
    parsedError = JSON.parse(error.message);
  } catch {
    parsedError = error;
  }

  return {
    success: false,
    message: parsedError.message || 'An unexpected error occurred',
    code,
    details: parsedError.errors || parsedError,
  };
};
