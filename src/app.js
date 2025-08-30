import express from 'express';
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: '30kb'}));
app.use(express.urlencoded({extended: true, limit: '30kb'}));
app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cookieParser());

//Routes
import userRouter from './routes/user.Routes.js';
import videoRouter from './routes/video.Routes.js';
import commentRouter from './routes/comment.Routes.js';

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', commentRouter);

export default app;
