const winston = require('winston');

const supabaseClient = require("../services/supabass-service/supabase");
const {
    getTodoItems,
    getUnfinishedTodoItems,
    addTodoItem,
    editTodoItem,
    deleteTodoItem,
} = require("../services/supabass-service/db-service");
const Summariser = require("../services/gemini-service/summariser");
const { postMessage } = require("../services/slack-service/webhooks");

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


const getTodos = async (req, res) => {

    const user_id = req.user.id

    const {data, error} = await getTodoItems(supabaseClient, {user_id})

    if (error) {
        logger.error('Failed to fetch todos', { error, user_id });

        return res.status(500).json({
            message: "Failed to fetch todos. Please try again later.",
        });
    } else {
        return res.status(200).json({
            data
        });
    }
}

const getUnfinishedTodosSummary = async (req, res) => {

    const user_id = req.user.id

    const {data, error} = await getUnfinishedTodoItems(supabaseClient, {user_id})

    if (error) {
        logger.error('Failed to fetch unfinished todos for summary', { error, user_id });

        return res.status(500).json({
            message: "Failed to generate summary. Please try again later.",
        });
    } else {
        try {
            const summariser = new Summariser();
            const summary = await summariser.generateSummary(data);
            logger.info('Summary generated successfully', { user_id, summary });
            const slackMessage = `Hello @${req.user.email}\n${summary}`
            const sendSlackMessage = await postMessage(slackMessage);

            if (sendSlackMessage) {
                return res.status(200).json({
                    summary
                });
            } else {
                logger.error('Failed to send summary to Slack', { error, user_id });
                return res.status(500).json({
                    message: "Failed to generate summary. Please try again later."
                });
            }

        } catch (summaryError) {
            logger.error('Failed to generate summary', { error: summaryError, user_id });

            return res.status(500).json({
                message: "Failed to generate summary. Please try again later."
            });
        }
    }
}

const addTodo = async (req, res) => {
    const user_id = req.user.id
    const {title, description = ""} = req.body;

    // Input validation
    if (!title) {
        return res.status(400).json({
            "message": "Title is required"
        });
    }

    if (title.length > 50) {
        return res.status(400).json({
            "message": "Title must be at most 50 characters"
        });
    }

    if (description && description.length > 200) {
        return res.status(400).json({
            "message": "Description must be at most 200 characters"
        });
    }

    // Basic sanitization
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    const {data, error} = await addTodoItem(supabaseClient, {
        user_id, 
        title: sanitizedTitle, 
        description: sanitizedDescription
    });

    if (error) {
        logger.error('Failed to add todo', { error, user_id, title: sanitizedTitle });
        return res.status(500).json({
            message: "Failed to add todo. Please try again later.",
        });
    } else {
        logger.info('Todo added successfully', { user_id, todo_id: data.id });
        return res.status(200).json({
            data
        });
    }

}

const editTodo = async (req, res) => {
    const user_id = req.user.id
    let {id, title, description = "", is_finished} = req.body;

    // Input validation
    if (!id) {
        return res.status(400).json({
            "message": "ID is required"
        });
    }

    if (!title) {
        return res.status(400).json({
            "message": "Title is required"
        });
    }

    if (title.length > 50) {
        return res.status(400).json({
            "message": "Title must be at most 50 characters"
        });
    }

    if (description && description.length > 200) {
        return res.status(400).json({
            "message": "Description must be at most 200 characters"
        });
    }

    // Convert is_finished to boolean
    is_finished = is_finished === "true" || is_finished === true;

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    const {data, error} = await editTodoItem(supabaseClient, {
        user_id, 
        id, 
        title: sanitizedTitle, 
        description: sanitizedDescription, 
        is_finished
    });

    if (error) {
        logger.error('Failed to edit todo', { error, user_id, id });
        return res.status(500).json({
            message: "Failed to edit todo. Please try again later.",
        });
    } else {
        logger.info('Todo edited successfully', { user_id, todo_id: id });
        return res.status(200).json({
            data
        });
    }
}

const deleteTodo = async (req, res) => {
    const user_id = req.user.id
    const id = req.params.id

    // Input validation
    if (!id) {
        return res.status(400).json({
            "message": "ID is required"
        });
    }

    const {data, error} = await deleteTodoItem(supabaseClient, {user_id, id});

    if (error) {
        logger.error('Failed to delete todo', { error, user_id, id });
        return res.status(500).json({
            message: "Failed to delete todo. Please try again later.",
        });
    } else {
        logger.info('Todo deleted successfully', { user_id, todo_id: id });
        return res.status(200).json({
            data
        });
    }
}

module.exports = {
    getTodos,
    getUnfinishedTodosSummary,
    addTodo,
    editTodo,
    deleteTodo
}
