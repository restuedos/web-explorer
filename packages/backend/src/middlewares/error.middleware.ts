import { ValidationError } from 'elysia';

export const errorMiddleware = ({ code, error }: { code: string; error: Error | ValidationError }) => {
  return new Response(JSON.stringify({ error: error.message }), {
    status: code === 'NOT_FOUND' ? 404 : 500,
  });
};
