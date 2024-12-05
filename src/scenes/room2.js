import { makeCartridge } from "../entities/healthCartridge.js";
import { makePlayer } from "../entities/player.js";
import { healthBar } from "../ui/healthBar.js";
import { state, statePropsEnum } from "../state/globalStateManager.js";
import { makeBoss } from "../entities/enemyBoss.js";
import {
  setBackgroundColor,
  setMapColliders,
  setCameraControls,
  setExitZones,
} from "./roomUtils.js";

export function room2(k, roomData, previousSceneData) {
  setBackgroundColor(k, "#a2aed5");

  k.camScale(4);
  k.camPos(200, 200);
  k.setGravity(1000);

  const roomLayers = roomData.layers;
  const map = k.add([k.pos(0, 0), k.sprite("room2")]);

  const colliders = roomLayers[4].objects;
  setMapColliders(k, map, colliders);

  const player = k.add(makePlayer(k));

  setCameraControls(k, player, map, roomData);

  const positions = roomLayers[6].objects;
  for (const position of positions) {
    if (
      position.name === "entrance-1" &&
      previousSceneData.exitName === "exit-1"
    ) {
      player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
      player.respawnIfOutOfBounds(10000, "room1");
      continue;
    }

    if (
      position.name === "entrance-2" &&
      previousSceneData.exitName === "exit-2"
    ) {
      player.setPosition(position.x + map.pos.x, position.y + map.pos.y);
      player.setControls();
      player.enablePassthrough();
      player.setEvents();
      player.respawnIfOutOfBounds(10000, "room2", { exitName: "exit-2" });
      k.camPos(player.pos);
      continue;
    }

    if (position.name === "boss" && !state.current().isBossDefeated) {
      const boss = map.add(makeBoss(k, k.vec2(position.x, position.y)));
      state.set(statePropsEnum.playerInBossFight, true);
      boss.setBehavior();
      boss.setEvents();
    }

    if (position.type === "cartridge") {
      map.add(makeCartridge(k, k.vec2(position.x, position.y)));
    }
  }

  const exits = roomLayers[5].objects;
  setExitZones(k, map, exits, "room1");


  healthBar.setEvents();
  healthBar.trigger("update");
  k.add(healthBar);
}
