import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config.js'
import carRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import monitoringRouter from "./routes/monitoringRoute.js"

// Swagger documentation
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger.js"

// Security imports
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import session from "express-session"
import cookieParser from "cookie-parser"
import csrf from "csurf"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"
import hpp from "hpp"

// Redis imports
import { connectRedis } from "./config/redis.js"

// Logging imports
import { logger } from "./config/logger.js"
import requestLogger from "./middleware/requestLogger.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import monitor, { requestMonitoring } from "./utils/monitoring.js"





//app config
const app = express()
const port = process.env.PORT || 4000;

// Enable request logging
app.use(requestLogger);

// Enable request monitoring
app.use(requestMonitoring);

// Enable cookie parser
app.use(cookieParser());


//middleware
app.use(express.json({ limit: '10kb' })) // Body limit is 10kb
app.use(cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: true
}))

// Security middleware
app.use(helmet()) // Set security HTTP headers

// Rate limiting
const limiter = rateLimit({
    max: process.env.RATE_LIMIT_MAX || 100, // Default: 100 requests from same IP
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000, // Default: 1 hour window
    message: 'Too many requests from this IP, please try again in an hour!'
})
app.use('/api', limiter)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

// Cookie parser and session for CSRF
app.use(cookieParser())

// Session configuration with Redis store if available
let sessionConfig = {
    secret: process.env.SESSION_SECRET || 'food-app-super-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
};

// Try to use Redis for session store if available
try {
    const RedisStore = (await import('connect-redis')).default;
    const { redisClient } = await import('./config/redis.js');
    
    if (redisClient.isOpen) {
        sessionConfig.store = new RedisStore({ client: redisClient });
        logger.info('Using Redis for session store');
    } else {
        logger.warn('Redis not connected, using memory session store');
    }
} catch (error) {
    logger.warn(`Redis session store error: ${error.message}. Using memory store.`);
}

app.use(session(sessionConfig))

// CSRF protection
const csrfProtection = csrf({ cookie: true })
// Apply CSRF protection to all routes that change state
app.use('/api/user', csrfProtection)
app.use('/api/cart', csrfProtection)
app.use('/api/order', csrfProtection)


//database connections
connectDB();

// Connect to Redis
connectRedis().catch(err => {
    logger.warn(`Redis connection failed: ${err.message}. Continuing without Redis.`);
});

//api endpoint
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", carRouter)
app.use("/api/order", orderRouter)
app.use("/api/monitoring", monitoringRouter)

// Swagger documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Food App API Documentation"
}))

app.get("/", (req, res) => {
    res.send("API Working")
})

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() })
})

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port} in ${process.env.NODE_ENV || 'development'} mode`)
    
    // Start system monitoring
    monitor.start();
})

