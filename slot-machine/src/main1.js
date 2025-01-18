import { Application, Text, Assets, Container, Graphics, Sprite} from 'pixi.js';
import { gsap } from 'gsap';

(async () => {
  const app = new Application();
  await app.init({
    background: '#000000',
    resizeTo: window,
  });

//   try {
//     const sounds = {
//     win: await Assets.load('slot-machine/src/assets/sounds/mixkit-casino-bling-achievement-2067.wav'),
//     lose: await Assets.load('slot-machinesrc/assets//mixkit-player-losing-or-failing-2042.wav'),
//     coin: await Assets.load('slot-machine/assets/sounds/mixkit-winning-a-coin-video-game-2069.wav')
// };
//   } catch (error) {
//     console.error('Error loading sounds:', error);
//     // Fallback if sounds fail to load
//     const sounds = {
//         spin: { play: () => {} },
//         tick: { play: () => {} },
//         win: { play: () => {} },
//         coin: { play: () => {} }
//     };
// }

const sounds = {
  spin: { play: () => {} },
  tick: { play: () => {} },
  win: { play: () => {} },
  coin: { play: () => {} }
};


  document.getElementById('app').appendChild(app.canvas);

  const gameContainer = new Container();
  gameContainer.x = app.screen.width / 2;
  gameContainer.y = app.screen.height / 2;
  app.stage.addChild(gameContainer);

  const title = new Text({
    text : 'Slot Machine',
    style: {
      fontFamily: 'Arial',
      fontSize: 48,
      fill: '#FFD700',
      align: 'center'
    }
  });
  
  // create the sprite's anchor point
  title.anchor.set(0.5);
  title.y = -200;
  gameContainer.addChild(title);

  // Load the bg texture
  const texture = await Assets.load('slot-machine/src/assets/images/casino.jpg');

  // Create a bg Sprite
  const bg = new Sprite(texture);

  // set the bg as the backround
  bg.anchor.set(0.5);
  bg.scale.set(0.5);
  gameContainer.addChild(bg);


  //slot machine frame
  const frame = new Graphics();
  frame.setStrokeStyle({color : 0xFFD700}); // Gold border
  frame.fill({ color: 0x4a4a4a });   // Gray fill
  frame.roundRect(-150, -150, 500, 300, 20);
  gameContainer.addChild(frame);

  //3 reel containers
  const reelContainer = new Container();
  const symbols = ['7️⃣', '🍒', '💎', '🔔', '⭐'];
  const reels = [];

  for(let i= 0; i < 3; i++){
    const reel = new Container();
    reel.x = (i - 1) * 150;

    for(let j = 0; j < 3; j++){
      const symbol = new Text({
        text: symbols[Math.floor(Math.random() * symbols.length)],
        style: { 
          fontSize: 64,
        }
      });
      symbol.y = j * 100;
      symbol.anchor.set(0.5);
      reel.addChild(symbol);
    }

    reels.push(reel);
    reelContainer.addChild(reel);
  }
  
  gameContainer.addChild(reelContainer);

  const spinButton = new Container();
  const buttonBg = new Graphics();
  buttonBg.fill({color: 0xFFD700 }); // gold
  buttonBg.roundRect(-60, -30, 120, 60, 15);

  const spinText = new Text({
    text: 'SPIN',
    style: {
      fontFamily: 'Arial',
      fontSize: 28,
      fill: 0x000000,
    }
  })

  spinText.anchor.set(0.5);
  spinButton.addChild(buttonBg, spinText);
  spinButton.y = 200;
  spinButton.interactive = true;
  gameContainer.addChild(spinButton);

  // bet controls
  let currentBet = 10;
  const betDisplay = new Text({
    text: `BET: £${currentBet}`,
    style: {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xFFD700,
    }
  });

  betDisplay.anchor.set(0.5);
  betDisplay.y = 150;
  gameContainer.addChild(betDisplay);

  // bet button function
  const createButton = (text, x, change) => {
    const button = new Container();
    const bg = new Graphics();
    bg.fill({color: 0x4a4a4a });
    bg.roundRect(-25, -20, 50, 40, 10);

    const buttonText = new Text({
      text,
      style: {
        fontSize: 24,
        fill: 0xFFD700,
      }
    });

    buttonText.anchor.set(0.5);

    button.addChild(bg, buttonText);
    button.x = x;
    button.y = 150;
    button.interactive = true;

    button.on('pointerdown', () => {
      sounds.coin.play();
      currentBet = Math.max(1, currentBet + change);
      betDisplay.text = `BET: £${currentBet}`;

    });

    return button;

  }

  const decreaseButton = createButton('-', -50, -5);
  const increaseButton = createButton('+', 50, 5);
  gameContainer.addChild(decreaseButton, increaseButton);

  let money = 1000;
  const moneyDisplay = new Text({
    text: `BALANCE: £${money}`,
    style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xFFD700,
    }
  });

  moneyDisplay.anchor.set(0.5);
  moneyDisplay.y = -150;
  moneyDisplay.x = 150;
  gameContainer.addChild(moneyDisplay)

  // spins
  let isSpinning = false;

  function spin() {
    if (isSpinning || currentBet > money) return;

    sounds.spin.play();

    isSpinning = true;
    money -= currentBet;
    moneyDisplay.text = `BALANCE: £${money}`;

    spinButton.interactive = false;

    reels.forEach((reel, i) => {
      const symbols = reel.children;

      const newSymbols = symbols.map(() => 
        symbols[Math.floor(Math.random() * symbols.length)].text
      );

      // Animating 
      gsap.to(reel.children, {
        duration: 2,
        y: "+=800",
        ease: "back.out(1)",
        stagger: {
          from: "start",
          amount: 0.3
        },
        delay: i * 0.2,
        modifers: {
          y: gsap.utils.unitize(y => parseFloat(y) % 300)
        },
        onComplete: () => {
          symbols.forEach((symbol, j) => {
            symbol.text = newSymbols[j];
            symbol.y = j * 100;
          });

          // Check if last reel
          if(i === reels.length - 1) {
            isSpinning = false;
            spinButton.interactive = true;
            checkWin();
          }
        }
      });
    });
  }

  function checkWin() {
    const middleSymbols = reels.map(reel => reel.children[1].text);

    if(middleSymbols.every(symbol => symbol === middleSymbols[0])){
      sounds.win.play();
      const winAmount = currentBet * 10;
      money += winAmount;
      moneyDisplay.text = `BALANCE: $${money}`;

      // win animation
      gsap.to(moneyDisplay.scale,{
        x: 1.5,
        y: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 3
      });
    }
  }

  spinButton.on('pointerdown', spin);
})();