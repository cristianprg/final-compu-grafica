import { k } from "./kaboomLoader.js";
import { room1 } from "./scenes/room1.js";
import { room2 } from "./scenes/room2.js";
import { setBackgroundColor } from "./scenes/roomUtils.js";
import { makeNotificationBox } from "./ui/notificationBox.js";

async function main() {
  const room1Data = await (await fetch("./maps/section2.json")).json();
  const room2Data = await (await fetch("./maps/section3.json")).json();

  k.scene("room1", (previousSceneData) => {
    room1(k, room1Data, previousSceneData);
  });
  k.scene("room2", (previousSceneData) => {
    room2(k, room2Data, previousSceneData);
  });

  k.scene("final-exit", () => {
    setBackgroundColor(k, "#20214a");
    k.add(
      makeNotificationBox(
        k,
        "Ganaste!\n The End. Thanks for playing! Autor: Crisitan Lopez."
      )
    );
  });
}

k.scene("intro", () => {
  setBackgroundColor(k, "#20214a");
  k.add(
    makeNotificationBox(
      k,
      "Derrota al asesino de la cueva!\nUsa las flechas para moverte, x para saltar, z para atacar.\nPresiona enter para empezar!"
    )
  );
  k.onKeyPress("enter", () => {
    // makes audio will be enabled before the game starts
    const context = new AudioContext();
    context.resume();
    k.go("room1", { exitName: null });
  });
});

k.go("intro");

main();
