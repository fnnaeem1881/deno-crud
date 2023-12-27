import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../config/database.ts";
import { Item } from "./../models/items.ts";
import {
  deleteByID,
  fetchAll,
  findByID,
  StoreData,
  updateData,
} from "./../helper/db_query.ts";
import { pusher } from "../helper/pusher.ts";
import amqp from "amqplib";
import { Buffer } from "node:buffer";
const AMQP_URL = "amqp://guest:guest@127.0.0.1:5672";

async function connectAndSendMessage() {
  try {
    const connection = await amqp.connect(AMQP_URL);
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");

    const queue = "hello";
    const msg = "Hello World!";

    await channel.assertQueue(queue, {
      durable: false,
    });

    for (let i = 0; i < 10000; i++) {
      await channel.sendToQueue(queue, Buffer.from(`${msg} ${i + 1}`));
      console.log(` [x] Sent ${msg} (${i + 1}/10000)`);
    }

    console.log('Finished sending messages');
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
    process.exit(1);
  }
}

async function consumeMessages() {
  try {
    const connection = await amqp.connect(AMQP_URL);
    console.log('Connected to RabbitMQ');
    const channel = await connection.createChannel();
    console.log('Channel created');
    const queue = 'hello';
    await channel.assertQueue(queue, {
      durable: false,
    });
    channel.consume(queue, (msg) => {
      if (msg.content) {
        console.log('Received message:', msg.content.toString());
      }
    }, {
      noAck: true,
    });
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
    process.exit(1);
  }
}

export const getItems = async (ctx: Context) => {
  const data = await fetchAll("items");
  // await connectAndSendMessage(); 
  await consumeMessages(); 

  ctx.response.body = data;
  ctx.response.status = 200;
};

export const getItemsById = async (ctx: Context) => {
  const { id } = ctx.params;
  const item = await findByID("items", id);
  if (item) {
    ctx.response.body = item;
  } else {
    ctx.response.status = Status.NotFound;
    ctx.response.body = { message: "Item not found" };
  }
};

export const getItemsStore = async (ctx) => {
  try {
    const data = await ctx.request.body({ type: "json" });
    const requestBody = await data.value;
    const newItem: Item = {
      name: requestBody.name,
      description: requestBody.description,
    };
    const store = await StoreData("items", newItem);
    const channel = "test-channel";
    const event = "test-event";
    const Pusherdata = {
      message: "This is My Pusher",
    };
    pusher.trigger(channel, event, Pusherdata)
      .then(() => console.log("Event triggered successfully"))
      .catch((error) => console.error("Error triggering event:", error));

    console.log(`Inserted ${store} rows`);

    ctx.response.body = { message: "Created Item!", Item: newItem };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request format" };
  }
};

export const ItemsUpdate = async (ctx: Context) => {
  try {
    const { id } = ctx.params;
    const data = await ctx.request.body({ type: "json" });
    const requestBody = await data.value;
    const newItem: Item = {
      id: id,
      name: requestBody.name,
      description: requestBody.description,
    };
    const store = await updateData("items", newItem);

    console.log(`Updated ${store} rows`);

    ctx.response.body = { message: "Updated Item!", Item: newItem };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request format" };
  }
};

export const ItemsDelete = async (ctx: Context) => {
  const { id } = ctx.params;
  const data = await deleteByID("items", id);
  console.log(`Deleted ${data} rows`);

  if (data > 0) {
    ctx.response.body = { message: "Deleted item!" };
  } else {
    ctx.response.status = Status.NotFound;
    ctx.response.body = { message: "Item not found" };
  }
};
