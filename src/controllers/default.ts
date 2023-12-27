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
import { redis } from "../helper/redis.ts";

import { ReceivedQueue, SendQueue } from "../helper/Queue.ts";

export const getItems = async (ctx: Context) => {
  const data = await fetchAll("items");
  const queue = "hello";
  const message = "This Is Test Message";
  
  const key = "example_key";
  const value = "example_value";
  const ok = await redis.set("hoge", "fuga");
 console.log(ok);
 const fuga = await redis.get("hoge");
 console.log('fuga',fuga);
 
  redis.close();
  
  await SendQueue(queue, message);
  // var QueueChannel = await ReceivedQueue(queue);
  // QueueChannel.consume(queue, (msg) => {
  //   if (msg.content) {
  //     console.log("Received message:", msg.content.toString());
  //   }
  // }, {
  //   noAck: true,
  // });

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
