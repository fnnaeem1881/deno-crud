import {
  Application,
  Context,
  RouterContext,
  Status,
} from "https://deno.land/x/oak/mod.ts";
import database from "./../../config/database.ts";
import { User } from "../../models/User.ts";
import { create } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { deleteByID, fetchAll, findByEmail, findByID, findByMobile, StoreData, updateData,} from "./../../helper/db_query.ts";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, signJwt, verifyJwt,} from "./../../helper/jwt.ts";

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
    const accessTokenExpiresIn = new Date(
      Date.now() + ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
    );
    const refreshTokenExpiresIn = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
    );

    const { token: access_token } = await signJwt({
      user_id: user.id,
      privateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY",
      expiresIn: accessTokenExpiresIn,
      issuer: "website.com",
    });
    const { token: refresh_token } = await signJwt({
      user_id: user.id,
      privateKeyPem: "REFRESH_TOKEN_PRIVATE_KEY",
      expiresIn: refreshTokenExpiresIn,
      issuer: "website.com",
    });
    // const jwt = await create({ alg: "HS512", typ: "JWT" }, { payload }, key);
    if (access_token) {
      ctx.response.status = 200;
      ctx.response.body = {
        userId: user.id,
        name: user.name,
        mobile: user.mobile,
        access_token: access_token,
        refresh_token: refresh_token,
        accessTokenExpiresIn: accessTokenExpiresIn,
        refreshTokenExpiresIn: refreshTokenExpiresIn,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "internal server error",
      };
    }
    return;
  } catch (error) {
    console.log(error);

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
    const existingUser = await findByMobile("users", requestBody.mobile);

    if (!existingUser || existingUser.length !== 0) {
      ctx.response.status = 409;
      ctx.response.body = { message: "Mobile already exists" };
      return;
    }
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

export const refreshAccessTokenController = async (ctx: Context,{ response,}: RouterContext<string>) => {
  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");
    const cookieToken = await ctx.cookies.get("refresh_token");
    let refresh_token;

    if (authorization) {
      refresh_token = authorization.split(" ")[1];
    } else if (cookieToken) {
      refresh_token = cookieToken;
    }



    const message = "Could not refresh access token";

    if (!refresh_token) {
      response.status = 403;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    const decoded = await verifyJwt<{ sub: string }>({
      token: refresh_token,
      publicKeyPem: "REFRESH_TOKEN_PUBLIC_KEY",
    });

    if (!decoded) {
      response.status = 403;
      response.body = {
        status: "fail",
        message,
      };
      return;
    }

    const accessTokenExpiresIn = new Date(
      Date.now() + ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
    );
    const refreshTokenExpiresIn = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
    );
    const userData = await findByID("users",  decoded.sub);

    if (!userData || userData.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: `User not found` };
      return;
    }
    const user = userData[0];
    const { token: access_token } = await signJwt({
      user_id: user.id,
      privateKeyPem: "ACCESS_TOKEN_PRIVATE_KEY",
      expiresIn: accessTokenExpiresIn,
      issuer: "website.com",
    });
    const { token: refresh_token_new } = await signJwt({
      user_id: user.id,
      privateKeyPem: "REFRESH_TOKEN_PRIVATE_KEY",
      expiresIn: refreshTokenExpiresIn,
      issuer: "website.com",
    });

  

    // cookies.set("access_token", access_token, {
    //   expires: accessTokenExpiresIn,
    //   maxAge: ACCESS_TOKEN_EXPIRES_IN * 60,
    //   httpOnly: true,
    //   secure: false,
    // });

    if (access_token) {
      ctx.response.status = 200;
      ctx.response.body = {
        userId: user.id,
        name: user.name,
        mobile: user.mobile,
        access_token: access_token,
        refresh_token: refresh_token_new,
        accessTokenExpiresIn: accessTokenExpiresIn,
        refreshTokenExpiresIn: refreshTokenExpiresIn,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        message: "internal server error",
      };
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Token has expaired",
    };
  }
};
