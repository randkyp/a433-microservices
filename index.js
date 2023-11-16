// import dotenv and use it to load environment variable from .env file
require('dotenv').config()

// import express framework
const express = require("express");
// initialize an express application
const app = express();

// load body-parser middleware to parse JSON request bodies
const bp = require("body-parser");
// tell express to use body-parser for JSON
app.use(bp.json());

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
    // connect to the RabbitMQ server
    connection = await amqp.connect(amqpServer);
    // create a new channel on the connection
    channel = await connection.createChannel();
    try {
        // RabbitMQ queue name
        const queue = "order";
        // make sure queue named "order" exists; if not, create it
        await channel.assertQueue(queue);
        // print message to the console
        console.log("Connected to the queue!")
    } catch (ex) {
        // log exception to the console
        console.error(ex);
    }
}

// define API endpoint at /order (POST) for creating orders
app.post("/order", (req, res) => {
    // destructure order from the request body
    const { order } = req.body;
    // call a function (defined below) to send a new order through RabbitMQ
    createOrder(order);
    // send the order data back to the requestee/client
    res.send(order);
});

// define async function
const createOrder = async order => {
    // RabbitMQ queue name
    const queue = "order";
    // send the order data to the queue as a string
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    // log message to the console
    console.log("Order succesfully created!")
    // catch SIGINT signal (CTRL-C process termination)
    process.once('SIGINT', async () => { 
        // log message to console
        console.log('got sigint, closing connection');
        // close AMQP channel
        await channel.close();
        // close AMQP connection
        await connection.close(); 
        // terminate gracefully; return zero (success)
        process.exit(0);
    });
};

// start the express server on the specified port
app.listen(process.env.PORT, () => {
    // print the server start message to the console
    console.log(`Server running at ${process.env.PORT}`);
});

