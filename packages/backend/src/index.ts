import path from "path";
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import 'reflect-metadata';
import { Elysia, ValidationError } from 'elysia';
import { cors } from '@elysiajs/cors';
import { AppDataSource } from '@/config/database';
import { errorMiddleware } from '@/middlewares/error.middleware';
import { setupRoutes } from '@/routes';

const app = new Elysia()
  .use(cors({
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  }))
  .onError(errorMiddleware);

  setupRoutes(app);

await AppDataSource.initialize()
  .then(() => console.log('✅ Database connected'))
  .catch((error: Error) => console.log('❌ Database connection failed:', error));

app.listen(3000);
console.log('✅ Server running at http://localhost:3000');
