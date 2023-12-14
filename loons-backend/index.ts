import Koa from "koa";
import route from "koa-route";
import websockify from "koa-websocket";
import crypto from "crypto";
import type { WebSocket } from "ws";

const app = websockify(new Koa());

interface Position {
  position_x: number;
  position_y: number;
  level: number;
}

let state: { [key: string]: Position } = {};

let ws: undefined | WebSocket;

let current_tick = 0;

function tick() {
  current_tick++;

  if (current_tick % 5 == 0) {
    const id = crypto.randomUUID();
    state[id] = {
      position_x: 50 * Math.random(),
      position_y: 50 * Math.random(),
      level: Math.random() < 0.9 ? 1 : 2,
    };
  }
  Object.entries(state).forEach(([id, { position_x, position_y, level }]) => {
    state[id] = {
      position_x: position_x + 5,
      position_y: 100 * Math.sin(position_x / 100),
      level: level,
    };
  });

  ws?.send(JSON.stringify({ loonState: state }));
}

app.ws.use(function (ctx, next) {
  return next(ctx);
});

// Using routes
app.ws.use(
  route.all("/", function (ctx) {
    ctx.websocket.on("message", function (message) {
      const msg = JSON.parse(message);
      if (msg.hasOwnProperty("subscribe")) {
        console.log(`Subscribed to channel ${msg.subscribe}`);
        if (msg.subscribe === "loonState") {
          ws = ctx.websocket;
          setInterval(tick, 200);
        }
      }

      if (msg.hasOwnProperty("publish")) {
        const loonid = msg.publish.popLoon.loonId;
        delete state[loonid];
      }
    });
  })
);

console.log("Server started");
app.listen(4000);

export default app;
