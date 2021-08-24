import Game from './core/game';

(async function () {

  const game = new Game();

  function update() {

  }

  const init = game.loop(update);
  init();
})();
