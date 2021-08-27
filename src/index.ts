import Game from './core/game';

(async function () {

  const game = new Game();
  console.log(game);
  function update() { }
  const init = game.loop(update);
  init();
})();
