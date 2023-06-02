const winston = require('winston');

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info', // Set the desired log level
  format: winston.format.json(), // Use JSON format for log messages
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to error.log file
    new winston.transports.File({ filename: 'logs/activity.log' }), // Log all activities to activity.log file
    new winston.transports.Console() // Log activities to the console
  ]
});

// Export the logger instance
module.exports = logger;