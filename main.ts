import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { serve } from "https://deno.land/std@0.150.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import * as logger from "https://deno.land/x/oak_logger@1.0.0/mod.ts";

const io = new Server();

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);
  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});



const app = new Application();
import router from "./src/routes/defualt.ts";
import AuthRoute from "./src/routes/auth.ts";

app.use(async (ctx, next) => {
  io.emit("hello", "world");
  console.log('Middleware!');
  ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  ctx.response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Middleware Logger
app.use(logger.default.logger);
app.use(logger.default.responseTime);


app.use(router.routes());
app.use(AuthRoute.routes());
app.use(router.allowedMethods());

const PORT1 = 8000;
const PORT2 = 3000;

const socketServer = serve(io.handler(), { port: PORT2 });
console.log(`Socket Server running on http://localhost:${PORT2}`);

await app.listen({ port: PORT1 });
console.log(`HTTP Server running on http://localhost:${PORT1}`);

for await (const request of socketServer) {
}
