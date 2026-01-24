import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { connectDB } from './config/db.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';

// Import routes
import authRouter from './routes/authRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import siteSettingsRouter from './routes/siteSettingsRoutes.js';
import chatRouter from './routes/chatRoutes.js';
// Removed old imports, they are re-imported below closer to usage if sticking to previous pattern,
// but better to keep imports at top.
import skillRouter from './routes/skillRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config({ path: '.env' });

// Create Express app
const app = express();
app.set('trust proxy', 1); // Trust first key in X-Forwarded-For header (Render/Netlify)
const PORT = process.env.PORT || 5000;

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Cross-Origin-Opener-Policy for Google OAuth Popups - REMOVED
// app.use((req, res, next) => {
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   next();
// });

// Enable CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_ORIGIN,
        process.env.CLIENT_URL,
        process.env.VITE_API_URL, // Legacy support
        // Localhost allowed for development - STRICTLY remove/guard in production if needed, 
        // but often useful for local testing against prod backend if carefully managed.
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173'
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(o => o && (o === origin || o.replace(/\/$/, '') === origin));

      if (isAllowed || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}. Add this URL to CLIENT_ORIGIN in your backend environment variables.`);
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        callback(new Error(msg), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  const morgan = await import('morgan');
  app.use(morgan.default('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 3000, // Increased from 100 to 3000 to prevent 429s during frequent usage/testing
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compression middleware
app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Portfolio API',
    documentation: 'https://github.com/yourusername/portfolio-api',
  });
});





// API routes


// ... 

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);
app.use('/api/skills', skillRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', siteSettingsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/chat', chatRouter);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: dbStatus === 'connected' ? 'ok' : 'error',
    db: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Handle 404 - Route not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

export default app;
// Restart trigger
// Restart trigger 2
