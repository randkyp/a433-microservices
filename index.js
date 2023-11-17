// import dotenv and use it to load environment variable from .env file
require('dotenv').config()

// import express framework
const express = require("express");
// initialize an express application
const app = express();

// load body-parser middleware to parse JSON request bodies
const bp = require("body-parser");

// import amqplib for async comms with RabbitMQ
const amqp = require("amqplib");
// load AMQP server url from environment variable
const amqpServer = process.env.AMQP_URL;
// variables to hold the AMQP channel and connection
var channel, connection;

// call the function (defined below) to connect to the RabbitMQ server
connectToQueue();

// define async function
async function connectToQueue() {
    try {
        // connect to the RabbitMQ server
        connection = await amqp.connect(amqpServer);
        // create a new channel on the connection
        channel = await connection.createChannel();
        // make sure queue named "order" exists; if not, create it
        await channel.assertQueue("order");
        // start consuming messages from the RabbitMQ "order" queue
        channel.consume("order", data => {
            // log the received order and print it to the console
            console.log(`Order received: ${Buffer.from(data.content)}`);
            console.log("** Will be shipped soon! **\n")
            // acknowledge the message
            channel.ack(data);
        });
    } catch (ex) {
        // log exception to the console
        console.error(ex);
    }
}

// start the express server on the specified port
// currently the code doesn't do anything with its listening port (no endpoints)
app.listen(process.env.PORT, () => {
    // print the server start message to the console
    console.log(`Server running at ${process.env.PORT}`);
});
