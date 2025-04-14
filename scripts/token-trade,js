Hooks.on("getTokenLayerHudButtons", (hudButtons) => {
  hudButtons.push({
    icon: "fas fa-handshake",
    title: "Request Trade",
    onClick: (token) => {
      const targetActor = token.actor;
      if (targetActor && targetActor.testUserPermission(game.user, "OWNER")) {
        socketlib.executeAsUser("requestTrade", game.user.id, targetActor.id);
      }
    }
  });
  return hudButtons;
});
