export class TradeWindow extends Application {
  static get defaultOptions() {
    return {
      template: "modules/trade-system/templates/trade-window.html",
      resizable: false,
      width: 700,
      height: 500
    };
  }

  async getData() {
    return {
      player1: game.users.get(this.player1Id).character,
      player2: game.users.get(this.player2Id).character,
      currencies: ["gp", "sp", "cp", "pp"]
    };
  }
}