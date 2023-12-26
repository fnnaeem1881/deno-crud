import { Application, Context, Status } from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { User } from "./../../models/Auth.ts";
import { create } from "https://deno.land/x/djwt@v2.4/mod.ts";

import {
  deleteByID,
  fetchAll,
  findByEmail,
  findByID,
  findByMobile,
  StoreData,
  updateData,
} from "./../../helper/db_query.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { key } from "./../../helper/jwt.ts";

export const Login = async (ctx) => {
  try {
    const data = await ctx.request.body({ type: "json" });
    const requestBody = await data.value;
    const mobile = requestBody.mobile;
    const password = requestBody.password;
    const userData = await findByMobile("users", mobile);

    if (!userData || userData.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: `User not found` };
      return;
    }
    const user = userData[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Incorrect password" };
      return;
    }
    const payload = {
      id: user.id,
      mobile: mobile,
    };
    const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
    if (jwt) {
      ctx.response.status = 200;
      ctx.response.body = {
        userId: user.id,
        name: user.name,
        mobile: user.mobile,
        token: jwt,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "internal server error",
      };
    }
    return;
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid request format" };
  }
};

export const Registration = async (ctx: Context) => {
  try {
    const data = await ctx.request.body({ type: "json" });
    const requestBody = await data.value;
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(requestBody.password, salt);
    const newItem: User = {
      name: requestBody.name,
      email: requestBody.email,
      mobile: requestBody.mobile,
      gender: requestBody.gender,
      dob: requestBody.dob,
      // access_token: "someAccessToken",
      // refresh_token: "someRefreshToken",
      // device_key: "someDeviceKey",
      password: hashedPassword,
      status: 1,
    };
    const store = await StoreData("users", newItem);
    ctx.response.body = { message: "create users!", user: newItem };
  } catch (error) {
    ctx.response.status = 400;
    ctx.response.body = { error: "somthing wrong" };
  }
};

