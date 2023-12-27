
import amqp from "amqplib";
import { Buffer } from "node:buffer";
const AMQP_URL = "amqp://guest:guest@127.0.0.1:5672";

export const SendQueue=async function (queue,message) {
  try {
    const connection = await amqp.connect(AMQP_URL);
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");



    await channel.assertQueue(queue, {
      durable: false,
    });

    for (let i = 0; i < 10000; i++) {
      await channel.sendToQueue(queue, Buffer.from(`${message} ${i + 1}`));
      console.log(` [x] Sent ${message} (${i + 1}/10000)`);
    }

    console.log('Finished sending messages');
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
    process.exit(1);
  }
}

export const ReceivedQueue= async function (queue) {
  try {
    const connection = await amqp.connect(AMQP_URL);
    console.log('Connected to RabbitMQ');
    const channel = await connection.createChannel();
    console.log('Channel created');
    await channel.assertQueue(queue, {
      durable: false,
    });
    return channel;
    
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    process.exit(1);
  }
}
