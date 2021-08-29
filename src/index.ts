import Game from './core/game';

(async function () {

  const game = new Game();
  (window as any).g = game;
  game.init();
  function update() { }
  const init = game.loop(update);
  init();
})();
