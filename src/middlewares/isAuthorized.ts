import { verify } from "https://deno.land/x/djwt@v2.4/mod.ts";
import { key } from "../helper/jwt.ts";
import { Context } from "https://deno.land/x/oak/mod.ts";

export const authorized = async (ctx: Context, next: any) => {
  try {
    const headers: Headers = ctx.request.headers;
    const authorization = headers.get("Authorization");

    if (!authorization) {
      ctx.response.status = 401;
      ctx.response.body = {
        message: "Authorization header is missing",
      };
      return;
    }
    
    const jwt = authorization.split(" ")[1];

    if (!jwt) {
      ctx.response.status = 401;
      ctx.response.body = {
        message: "JWT token is missing",
      };
      return;
    }

    console.log(jwt);
    const payload = await verify(jwt, key);
    console.log('asd');
    
    if (!payload) {
      throw new Error("!payload");
    }

    ctx.state.user = payload;

    await next();
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = {
      message: "You are not authorized to access this route",
    };
    return;
  }
};
