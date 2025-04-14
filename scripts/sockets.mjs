/* sockets.mjs */
import { socketlib } from "./trade.mjs";

export function registerSockets() {
  const socket = socketlib.registerModule("trade-system");

  // Trade request from Player A to Player B
socket.register("requestTrade", (requesterId, targetActorId) => {
  const requester = game.users.get(requesterId);
  const targetActor = game.actors.get(targetActorId);
  
  new Dialog({
    title: "Trade Request",
    content: `${requester.name} wants to trade with ${targetActor.name}`,
    buttons: {
      accept: {
        label: "Accept",
        callback: () => TradeWindow.open(requesterId, targetActorId)
      },
      reject: { label: "Reject" }
    }
  }).render(true);
});

  // Open trade window for both players
  socket.register("openTradeWindow", (player1Id, player2Id) => {
    const tradeWindow = new TradeWindow(player1Id, player2Id);
    tradeWindow.render(true);
  });
}

// Initialize sockets when the module loads
Hooks.once("ready", () => {
  if (!game.modules.get("socketlib")?.active) {
    console.error("Trade System | SocketLib not active!");
    return;
  }
  registerSockets();
});
