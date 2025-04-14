import { TradeWindow } from "./TradeWindow.js";

Hooks.once("init", () => {
  // Register SocketLib (see sockets.js)
});

Hooks.on("getUserContextOptions", (html, options) => {
  options.push({
    name: "Request Trade",
    icon: '<i class="fas fa-handshake"></i>',
    condition: user => user.id !== game.user.id,
    callback: target => requestTrade(target)
  });
  return options;
});

function requestTrade(targetUserId) {
  // SocketLib emit to target user
}