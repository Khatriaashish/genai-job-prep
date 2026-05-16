const mongoose = require("mongoose");

let connectionPromise;

async function connectToDB() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGO_URI);
    }

    await connectionPromise;

    return mongoose.connection;
}

module.exports = connectToDB;