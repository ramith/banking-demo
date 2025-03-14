require("dotenv").config();

const { Kafka } = require("kafkajs");
const fs = require("fs");
const path = require("path");

const kafka = new Kafka({
  clientId: "transmitter",
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

const producer = kafka.producer();

const sendMessage = async () => {
  await producer.connect();
  console.log("** Connected to Kafka broker **");

  const message = {
    value: JSON.stringify({
      text: "Hello from transmitter",
      timestamp: new Date().toISOString(),
    }),
  };

  await producer.send({
    topic: process.env.KAFKA_TOPIC,
    messages: [message],
  });

  console.log("---- Message sent:", message.value);
  await producer.disconnect();
};

sendMessage().catch(console.error);
