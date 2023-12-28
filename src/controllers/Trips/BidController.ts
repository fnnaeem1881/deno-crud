import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { Bid } from "./../../models/Bid.ts";
import { deleteByID, fetchAll, findByID, StoreData, updateData,} from "./../../helper/db_query.ts";
import { pusher } from "../../helper/pusher.ts";
import { redis } from "../../helper/redis.ts";

import { ReceivedQueue, SendQueue } from "../../helper/Queue.ts";


  export const getBidById = async (ctx: Context) => {
    const { id } = ctx.params;
    const item = await findByID("bids", id);
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
      };
      const store = await StoreData("bids", newItem);
      const InsertBids = await findByID("trips", store.lastInsertId);

      const channel = `trips-channel-${store.lastInsertId}-${user.id}`;
      
      const event = `trips-event-${store.lastInsertId}-${user.id}`;
      console.log(channel);
      console.log(event);


      pusher.trigger(channel, event, InsertBids)
        .then(() => console.log("Event triggered successfully"))
        .catch((error) => console.error("Error triggering event:", error));

      console.log(`Inserted ${InsertBids}`);
      ctx.response.body = { message: "Created Trips!", Trips: newItem };
    } catch (error) {
      console.log(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Something wrong" };
    }
  };