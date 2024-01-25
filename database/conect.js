const { MongoClient } = require("mongodb")
require("dotenv").config()

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL ENVIROMNMENT MISSING")
    process.exit(1)
}

const client = new MongoClient(process.env.DATABASE_URL)

module.exports = {
    client
}
