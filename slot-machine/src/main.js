import { Application, BlurFilter, Sprite, Text, Assets, Graphics, Container } from "pixi.js";
import { gsap } from "gsap";

(async() => {
    const app = new Application();
    await app.init({
        background: "#000000",
        resizeTo: window,
    });

    document.getElementById("app").appendChild(app.canvas);

    // Create a container for everything
    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    const texture = await Assets.load('./src/assets/images/casino.jpg');
    const bg = new Sprite(texture);

    // Adding the casino background + blur effect
    bg.anchor.set(0.5);
    bg.x = app.screen.width / 2;
    bg.y = app.screen.height / 2;

    const blurFilter = new BlurFilter();
    blurFilter.strength = 10;
    bg.filters = [blurFilter];

    gameContainer.addChild(bg);

    // Creating the slot machine
    const slotMachine = new Graphics();
    console.log("Initial slot machine position:", slotMachine.x, slotMachine.y);
    console.log("Screen dimensions:", app.screen.width, app.screen.height);

    slotMachine.rect(0, 0, 400, 600);
    slotMachine.fill({ color: 0x000000, alpha: 0.9 });
    slotMachine.x = 100;  
    slotMachine.y = 100; 

    gameContainer.addChild(slotMachine);
    console.log("Slot machine added to container");

})();