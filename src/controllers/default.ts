import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../config/database.ts";
import { create, fetchAll, findByID,update,deleteByID, Item } from "./../models/items.ts";

export const getItems = async (ctx: Context) => {
  const data = await fetchAll();

  ctx.response.body = data;
  ctx.response.status = 200;
};

export const getItemsById = async (ctx: Context) => {
  const { id } = ctx.params;
  const item = await findByID(id);
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
    const store = await create(newItem);

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
    const store = await update(newItem);

    console.log(`Updated ${store} rows`);

    ctx.response.body = { message: "Updated Item!", Item: newItem };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request format" };
  }
};

export const ItemsDelete = async (ctx: Context) => {
  const { id } = ctx.params;
  const data = await deleteByID(id);
  console.log(`Deleted ${data} rows`);

  if (data > 0) {
      ctx.response.body = { message: "Deleted item!" };
  } else {
      ctx.response.status = Status.NotFound;
      ctx.response.body = { message: "Item not found" };
  }
};

