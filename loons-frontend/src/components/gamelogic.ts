import { useGameState } from "./gameState";
import { LoonStateMessage, Position } from "./types";

export function init() {
  let { getState, setState } = useGameState;
  let { ws, mergePatch, shootInterval } = getState();
  if (ws !== undefined) return;

  ws = new WebSocket("ws://localhost:4000/");

  ws.onmessage = (msg: MessageEvent<LoonStateMessage>) => {
    mergePatch(JSON.parse(msg.data).loonState);
  };

  ws.onopen = () => ws?.send(JSON.stringify({ subscribe: "loonState" }));

  if (shootInterval) {
    window.clearInterval(shootInterval);
  }
  setState({ ws, shootInterval: window.setInterval(shoot, 1000) });
}

function get_closest(
  tower_pos: Position,
  loons: Map<string, Position>
): string | undefined {
  let closest: undefined | string = undefined;
  let closest_distance: undefined | number = undefined;

  loons.forEach((pos, id) => {
    if (tower_pos.level < pos.level) return;

    let distance = dist(tower_pos, pos);
    if (closest_distance === undefined || distance < closest_distance) {
      closest_distance = distance;
      closest = id;
    }
  });
  return closest;
}

export function shoot() {
  let { getState, setState } = useGameState;
  let { ws, towers, loons } = getState();

  let lasers: { start: Position; end: Position }[] = [];

  towers.forEach((tower_pos, idx) => {
    for (let i = 0; i < tower_pos.level; i++) {
      let closest_loon = get_closest(tower_pos, loons);
      if (closest_loon) {
        lasers.push({ start: tower_pos, end: loons.get(closest_loon)! });
        loons.delete(closest_loon);
        send_deletion_message(ws!, closest_loon);
      }
    }
  });
  setState({ lasers: lasers, loons: loons });
  setTimeout(() => setState({ lasers: [] }), 200);
}

function dist(pos1: Position, pos2: Position) {
  return (
    Math.pow(pos1.position_x - pos2.position_x, 2) +
    Math.pow(pos1.position_y - pos2.position_y, 2)
  );
}

function send_deletion_message(ws: WebSocket, id: string) {
  let msg = {
    publish: {
      popLoon: {
        loonId: id,
      },
    },
  };
  ws.send(JSON.stringify(msg));
}
