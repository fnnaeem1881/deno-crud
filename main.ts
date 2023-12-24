
import {
  Application,
  Router,
  Context,
  Status,
} from "https://deno.land/x/oak/mod.ts";

const app = new Application();
import router from "./src/routes/defualt.ts";


app.use(async (ctx, next) => {
  console.log('Middleware!');
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(router.routes());
app.use(router.allowedMethods());




const PORT = 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
