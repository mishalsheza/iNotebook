const mongoose = require('mongoose');
const MONGO_URL = "mongodb://localhost:27017/inotebook"; // Ensure database name is specified

const connectToMongo = async () => {
    try {
        await mongoose.connect(MONGO_URL); // No need for useNewUrlParser & useUnifiedTopology
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectToMongo;
