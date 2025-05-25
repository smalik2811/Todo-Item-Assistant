const winston = require('winston');

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
});

async function postMessage(message) {
    const payload = {text: message}

    try {
        logger.info('Sending message to Slack webhook', { messageLength: message.length });

        const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            logger.info('Message sent to Slack successfully');
            return true;
        } else {
            logger.error('Failed to send message to Slack', { 
                status: response.status, 
                statusText: response.statusText 
            });
            return false;
        }
    } catch (error) {
        logger.error('Error sending message to Slack', { error });
        return false;
    }
}

module.exports = {
    postMessage
};
