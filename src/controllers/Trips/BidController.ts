import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { Bid } from "./../../models/Bid.ts";
import {
  deleteByID,
  fetchAll,
  findAnyIdWithColumnName,
  findByID,
  StoreData,
} from "./../../helper/db_query.ts";
import { pusher } from "../../helper/pusher.ts";
import { redis } from "../../helper/redis.ts";

import { ReceivedQueue, SendQueue } from "../../helper/Queue.ts";
export const getBidById = async (ctx: Context) => {
  const { id } = ctx.params;
  let item: any;
  console.log(id);

  // const item = await findAnyIdWithColumnName("bids","trip_id", id);
  const keyType = await redis.type(id);

  if (keyType === "list") {
     // const index = 2;
    // const storedData = await redis.lindex(id, index);

    // if (storedData) {
    //   const item = JSON.parse(storedData);
    //   console.log(`Item at index ${index}:`, item);
    // } else {
    //   console.log(`No data found at index ${index} for id: ${id}`);
    // }
    const storedData = await redis.lrange(id, 0, -1);
    item = storedData.map((itemData, index) => ({
      ...JSON.parse(itemData),
      index,
    }));
  } else if (keyType === "string") {
    const storedData = await redis.get(id);
    if (storedData) {
      item = { ...JSON.parse(storedData), index: 0 };
    } else {
      console.log(`No data found for id: ${id}`);
    }
  } else {
    console.log(
      `Key ${id} is of type ${keyType}, expected type 'list' or 'string'.`,
    );
  }
  
  if (item) {
    ctx.response.body = item;
  } else {
    ctx.response.status = Status.NotFound;
    ctx.response.body = { message: "Bid not found" };
  }
};


export const BidStore = async (ctx) => {
  try {
    const user = ctx.state.user;
    const data = await ctx.request.body({ type: "json" });
    const requestBody = await data.value;
    const newItem: Bid = {
      amount: requestBody.amount,
      trip_id: requestBody.trip_id,
      driver_id: user.id,
      created_at: new Date().toISOString(),
    };

    const store = await StoreData("bids", newItem);

    const TripId = `${requestBody.trip_id}`;
    const jsonString = JSON.stringify(newItem);

    const keyType = await redis.type(TripId);

    if (keyType === "list") {
      const rpushResult = await redis.rpush(TripId, jsonString);
      console.log("rpush result:", rpushResult);
    } else if (keyType === "string") {
      const lpushResult = await redis.lpush(TripId, jsonString);
      console.log("lpush result:", lpushResult);
    } else if (keyType === "none") {
      const rpushResult = await redis.rpush(TripId, jsonString);
      console.log("rpush result:", rpushResult);
    } else {
      console.log(
        `Key ${TripId} is of type ${keyType}, expected type 'list' or 'string'.`,
      );
    }

    const InsertBids = await findByID("bids", store.lastInsertId);

    const channel = `bid-channel-${requestBody.trip_id}`;

    const event = `bid-event-${requestBody.trip_id}`;
    console.log(channel);
    console.log(event);
    pusher.trigger(channel, event, InsertBids)
      .then(() => console.log("Bid Event triggered successfully"))
      .catch((error) => console.error("Error triggering event:", error));

    console.log(`Inserted ${InsertBids}`);
    ctx.response.body = {
      message: "Bid submit successfully !",
      Trips: newItem,
    };
  } catch (error) {
    console.log(error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Something wrong" };
  }
};
