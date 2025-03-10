import express from 'express';
import cors from 'cors';
import routes from './routes';
import cookieParser from 'cookie-parser';
import { limiter, speedLimiter } from './middleware/RateLimiter';
import { Server as HttpServer, createServer as createHttpServer } from 'http';

const app = express();

app.use(cookieParser());
app.use(cors(
  {
    origin: '*',
    credentials: true, // Allow cookies to be sent
  }
));
app.use(express.json());

// Apply rate limiting and request throttling globally
app.use(limiter);
app.use(speedLimiter);

// express api
app.use('/', routes);

let httpServer: HttpServer;
httpServer = createHttpServer(app);

httpServer.listen(3005, () => {
  console.info(`Listening on 3005`);
});

export default app;