import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { Trip } from "./../../models/trips.ts";
import { deleteByID, fetchAll, findByID, StoreData, updateData,} from "./../../helper/db_query.ts";
import { pusher } from "../../helper/pusher.ts";
import { redis } from "../../helper/redis.ts";

import { ReceivedQueue, SendQueue } from "../../helper/Queue.ts";


export const getTrips = async (ctx: Context) => {
    const user = ctx.state.user;
    if (user) {
      const data = await fetchAll("trips");
      ctx.response.body = { user, trips: data };
      ctx.response.status = 200;
    } else {
      ctx.response.body = { error: "Authentication required" };
      ctx.response.status = 401;
    }
  };
  export const getTripsById = async (ctx: Context) => {
    const { id } = ctx.params;
    const item = await findByID("trips", id);
    if (item) {
      ctx.response.body = item;
    } else {
      ctx.response.status = Status.NotFound;
      ctx.response.body = { message: "trips not found" };
    }
  };
  
  export const TripsStore = async (ctx) => {
    try {
      const user = ctx.state.user;
      const data = await ctx.request.body({ type: "json" });
      const requestBody = await data.value;
      const newItem: Trip = {
        car_name: requestBody.car_name,
        pick_up_location: requestBody.pick_up_location,
        destination: requestBody.destination,
        user_id: user.id,
      };
      const store = await StoreData("trips", newItem);
      const Inserttrips = await findByID("trips", store.lastInsertId);

      const channel = 'trips-channel';
      
      const event = 'trips-event';
      console.log(channel);
      console.log(event);
      pusher.trigger(channel, event, Inserttrips)
        .then(() => console.log("Trip Event triggered successfully"))
        .catch((error) => console.error("Error triggering event:", error));

      console.log(`Inserted ${Inserttrips}`);
      ctx.response.body = { message: "Created Trips!", Trips: newItem };
    } catch (error) {
      console.log(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Something wrong" };
    }
  };
  
//   export const TripsUpdate = async (ctx: Context) => {
//     try {
//       const { id } = ctx.params;
//       const data = await ctx.request.body({ type: "json" });
//       const requestBody = await data.value;
//       const newItem: Trip = {
//         id: id,
//         name: requestBody.name,
//         description: requestBody.description,
//       };
//       const store = await updateData("trips", newItem);
  
//       console.log(`Updated ${store} rows`);
  
//       ctx.response.body = { message: "Updated trips!", Item: newItem };
//     } catch (error) {
//       ctx.response.status = 400;
//       ctx.response.body = { error: "Invalid request format" };
//     }
//   };
  
  export const TripsDelete = async (ctx: Context) => {
    const { id } = ctx.params;
    const data = await deleteByID("trips", id);
    console.log(`Deleted ${data} rows`);
  
    if (data > 0) {
      ctx.response.body = { message: "Deleted trips!" };
    } else {
      ctx.response.status = Status.NotFound;
      ctx.response.body = { message: "trips not found" };
    }
  };
  