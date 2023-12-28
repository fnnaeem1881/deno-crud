
import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { deleteByID, fetchAll, findByID, StoreData, updateData,} from "./../../helper/db_query.ts";

export const getUser = async (ctx: Context) => {
    const user = ctx.state.user;
    if (user) {
      const data = await findByID("users",user.id);
      ctx.response.body = { user };
      ctx.response.status = 200;
    } else {
      ctx.response.body = { error: "Authentication required" };
      ctx.response.status = 401;
    }
  };