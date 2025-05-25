require("dotenv").config()
const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const winston = require("winston")

const dbRouter = require("./router/db-router")
const supabaseClient = require("./services/supabass-service/supabase");

// Configure Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
})

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
}))

// Apply security headers
app.use(helmet())

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
})
app.use(limiter)

// Logging middleware
app.use("/", (req, res, next) => {
    logger.info(`${req.method}: ${req.url} - IP: ${req.ip}`)
    next()
})

app.use(express.json())

app.use(
    "/api/v1/db",
    [
        async (req, res, next) => {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).send("Unauthorized");
            } else {
                const token = authHeader.split(" ")[1];
                const {data, error} = await supabaseClient.auth.getUser(token)

                if (error) {
                    return res.status(401).send("Invalid token");
                } else {
                    req.user = data.user
                    next()
                }

            }
        },
        dbRouter
    ]
)

app.all("/", (req, res) => {
    res.status(404).send("Not Found")
})

app.listen(PORT, (error) => {
    if (error) {
        logger.error(`Error starting server: ${error.message}`, { error })
    } else {
        logger.info(`Server is running on port ${PORT}`)
    }
})
