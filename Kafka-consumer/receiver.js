require("dotenv").config();

const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");

const kafka = new Kafka({
  clientId: "receiver",
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    ca: [
      fs.readFileSync(path.join(__dirname, process.env.KAFKA_CA_CERT), "utf-8"),
    ],
    key: fs.readFileSync(
      path.join(__dirname, process.env.KAFKA_CLIENT_KEY),
      "utf-8"
    ),
    cert: fs.readFileSync(
      path.join(__dirname, process.env.KAFKA_CLIENT_CERT),
      "utf-8"
    ),
    rejectUnauthorized: true,
  },
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

const receiveMessages = async () => {
  await consumer.connect();
  console.log("** Connected to Kafka broker **");

  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log(`---- Received: ${message.value.toString()}`);
    },
  });
};

receiveMessages().catch(console.error);
