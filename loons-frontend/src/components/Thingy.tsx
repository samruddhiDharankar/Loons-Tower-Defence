"use client";

import { useEffect } from "react";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import "./thingy.css";

import { useStore } from "zustand";
import { useGameState } from "./gameState";
import { init } from "./gamelogic";

function App() {
  const { loons, towers, lasers, addTower, upgradeTower } =
    useStore(useGameState);

  useEffect(init, []);

  return (
    // <div style={{height:"100vh",width:'100vw'}} onMouseDown={((e) => {
    //   setTurretPos([...turretPos,{x:e.clientX,y:e.clientY}])
    // })}>
    // {Object.entries(data.loonState).map(([key,value]) => (<Loon key={key} id={key} position={value}/>))}
    // {turretPos.map((t) => (<Turret key={t} position = {t} />))}
    // </div>

    <div className="container">
      <Stage
        className="canvas"
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
        onMouseDown={(event) => {
          let elem = document.querySelector(".canvas")!;
          let rect = elem.getBoundingClientRect();
          let mouseX = event.evt.clientX - rect.x;
          let mouseY = event.evt.clientY - rect.y;
          let was_upgraded = false;
          let is_overlapping = towers.map(
            (tower) =>
              mouseX >= tower.position_x &&
              mouseX <= tower.position_x + 10 &&
              mouseY >= tower.position_y &&
              mouseY <= tower.position_y + 10
          );

          is_overlapping.forEach((it, idx) => {
            if (it) {
              upgradeTower(idx);
              was_upgraded = true;
            }
          });

          if (!was_upgraded)
            addTower({
              position_x: event.evt.clientX - rect.x - 5,
              position_y: event.evt.clientY - rect.y - 5,
              level: 1, //TODO
            });
        }}
      >
        <Layer>
          {[...loons.entries()].map(([key, value]) => (
            <Circle
              key={key}
              x={value.position_x}
              y={value.position_y}
              stroke={value.level == 1 ? "blue" : "black"}
              radius={value.level == 1 ? 2 : 10}
            />
          ))}

          {towers.map((value, idx) => (
            <Rect
              key={idx}
              x={value.position_x}
              y={value.position_y}
              stroke={value.level == 1 ? "red" : "blue"}
              width={10}
              height={10}
            />
          ))}

          {lasers.map(({ start, end }, idx) => (
            <Line
              key={idx}
              points={[
                start.position_x,
                start.position_y,
                end.position_x,
                end.position_y,
              ]}
              strokeWidth={2}
              fill="red"
              stroke="green"
            ></Line>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
