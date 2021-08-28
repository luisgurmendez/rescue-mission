import Game from './core/game';

(async function () {

  const game = new Game();
  console.log(game);
  game.init();
  function update() { }
  const init = game.loop(update);
  init();
})();
