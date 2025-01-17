import { Application, Text, Assets, Container, Graphics} from 'pixi.js';
import { gsap } from 'gsap';

(async () => {
  const app = Application();
  await app.int({
    background: '#000000',
    resizeTo: window,
  });

  document.getElementById('app').appendChild(app.canvas);

  const gameContainer = new Container();
  gameContainer.x = app.screen.width / 2;
  gameContainer.y = app.screen / 2;
  app.stage.appendChild(gameContainer);

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

  //slot machine frame
  const frame = new Graphics();
  frame.fill({color: 0x4a4a4a});
  frame.roundRect(-250, -150, 500, 300, 20);
  gameContainer.addChild(frame);

  //3 reel containers
  const reelContainer = new Container();
  const symbols = ['7️⃣', '🍒', '💎', '🔔', '⭐'];
  const reels = [];

  for(let i= 0; i < 3; i++){
    const reel = new Container();
    reel.x = (i - 1) * 150;
  }

  // adding symbols to each reel
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
}
)();