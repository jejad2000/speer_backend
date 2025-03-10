import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." },
});

export const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Allow 50 requests per window before slowing down
    delayMs: () => 500, // Add 500ms delay per request after the limit
});