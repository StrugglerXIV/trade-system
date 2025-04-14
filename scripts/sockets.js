/* sockets.js */
import { socketlib } from "./trade.js";

export function registerSockets() {
  const socket = socketlib.registerModule("trade-system");

  // Trade request from Player A to Player B
  socket.register("requestTrade", (requesterId, targetId) => {
    const requester = game.users.get(requesterId);
    const target = game.users.get(targetId);
    
    new Dialog({
      title: game.i18n.localize("TRADE.Request"),
      content: `
        <p>${requester.name} wants to trade with you!</p>
        <p>Accept to open the trade window.</p>
      `,
      buttons: {
        accept: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize("TRADE.Accept"),
          callback: () => socket.executeAsUser("openTradeWindow", requesterId, targetId)
        },
        reject: {
          icon: '<i class="fas fa-times"></i>',
          label: "Reject"
        }
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