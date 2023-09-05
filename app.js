import express from 'express';
import userRouter from './routes/user.js';
import taskRouter from './routes/task.js';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.js';
import cors from 'cors';
export const app = express();
config({
  path: './data/config.env',
});
//using middlware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URI],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
//using routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
//error handler middleware

app.use(errorMiddleware);
app.get('/', (req, res) => {
  res.send('Nice working');
});
