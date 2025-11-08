
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient, RedisClientType } from 'redis';
import RedisStore from 'rate-limit-redis';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';
import { findSimilarPackagesInBackend } from './geminiService';
//  import functions from "firebase-functions";

dotenv.config();

const app = express();
// const port = process.env.PORT || 3001;

// --- CORS Setup ---
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL, 
    process.env.FRONTEND_URL2, 
    'http://localhost:5173'
  ].filter((origin): origin is string => origin !== undefined),
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// This async function will set up Redis and start the server
async function startServer() {
  const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_URL } = process.env;
  let redisClient: RedisClientType | undefined;
  let limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after a minute.' },
  });

  // --- Redis and Rate Limiter Setup ---
  if (REDIS_HOST && REDIS_PORT) {
      redisClient = createClient({
          password: REDIS_PASSWORD,
          socket: {
              host: REDIS_HOST,
              port: Number(REDIS_PORT),
              tls: false
          }
      });
  } else if (REDIS_URL) {
      redisClient = createClient({ url: REDIS_URL });
  }

  if (redisClient) {
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));

    try {
      console.log('Attempting to connect to Redis...');
      await redisClient.connect();
      console.log('Successfully connected to Redis server.');

      const store = new RedisStore({
        sendCommand: (...args: string[]) => (redisClient as RedisClientType).sendCommand(args),
      });

      limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        standardHeaders: true,
        legacyHeaders: false,
        store: store,
        message: { message: 'Too many requests from this IP, please try again after a minute.' },
      });
      console.log('Rate limiting configured with Redis store.');

    } catch (err) {
      console.error('Failed to connect to Redis. Falling back to in-memory rate limiter.', err);
      redisClient = undefined; // Ensure client is not used if connection failed
    }
  }

  // If Redis is not configured or connection failed, use in-memory store
  // if (!redisClient) {
  //   console.warn('WARNING: Rate limiting will use in-memory store (not suitable for production).');
  //   limiter = rateLimit({
  //     windowMs: 60 * 1000,
  //     max: 10,
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //     message: { message: 'Too many requests from this IP, please try again after a minute.' },
  //   });
  // }

  // Apply the rate limiter to all requests to /api
  app.use('/api', limiter);

  // --- API Routes ---
  app.post('/api/find-packages', async (req: express.Request, res: express.Response) => {
    const { sourcePackage, sourceLang, targetLang } = req.body;

    if (!sourcePackage || !sourceLang || !targetLang) {
      return res.status(400).json({ message: 'Missing required fields: sourcePackage, sourceLang, targetLang' });
    }

    if (typeof sourcePackage !== 'string' || typeof sourceLang !== 'string' || typeof targetLang !== 'string') {
      return res.status(400).json({ message: 'All fields must be strings.' });
    }

    const cacheKey = `package-pal:${sourcePackage}:${sourceLang}:${targetLang}`;
    const CACHE_TTL_SECONDS = 3600; // 1 hour

    try {
      if (redisClient && redisClient.isOpen) {
        const cachedResult = await redisClient.get(cacheKey);
        if (cachedResult) {
          console.log('Serving from cache:', cacheKey);
          return res.json(JSON.parse(cachedResult));
        }
      }

      const results = await findSimilarPackagesInBackend(sourcePackage, sourceLang, targetLang);
      
      if (redisClient && redisClient.isOpen) {
        await redisClient.set(cacheKey, JSON.stringify(results), { EX: CACHE_TTL_SECONDS });
        console.log('Cached result for:', cacheKey);
      }
      return res.json(results);

    } catch (error: any) {
      console.error('Error in /api/find-packages:', error);
      if (error.message?.includes("Gemini API Key is not configured")) {
          return res.status(503).json({ message: 'Service temporarily unavailable due to API key configuration issue.' });
      }
      if (error.message?.includes("Failed to fetch package suggestions from Gemini")) {
           return res.status(502).json({ message: 'Error communicating with the AI service. Please try again later.' });
      }
      return res.status(500).json({ message: error.message || 'An internal server error occurred.' });
    }
  });

  // --- Global Error Handler ---
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).send({ message: 'Something broke!' });
  });
// exports.app = functions.https.onRequest(app);
  // app.listen(port, () => {
  //   console.log(`Backend server listening on http://localhost:${port}`);
  //   if (!process.env.GEMINI_API_KEY) {
  //     console.warn('WARNING: API_KEY is not set in the environment. Gemini API calls will fail.');
  //   }
  // });
}

startServer().catch(err => {
    console.error("Failed to start the server:", err);
    global.process.exit(1);
});

export default app;