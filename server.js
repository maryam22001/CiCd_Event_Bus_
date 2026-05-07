//the body of the program 
require('dotenv').config();
const app = require("./src/app.js");
const connectDB = require("./src/config/connectDB.js");
const port = process.env.PORT || 8000;

// Create an async function to handle the startup sequence
const startServer = async () => {
    try {
        // 1. Connect to DB first (Wait for it to finish)
        await connectDB();
        
        // 2. Only start the server if DB connection is successful
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error.message);
    }
};

startServer();