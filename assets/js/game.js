WIDTH = 480;
HEIGHT = 320;

class Game {
  constructor() {
    this.playerPaddle = new Paddle(-1.0);
    this.enemyPaddle = new Paddle(-10.0);

    this.camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.domElement.id = 'game-container';
    document.body.appendChild(this.renderer.domElement);

    this.step(0);
  }

  step(t) {
    this.playerPaddle.step(t);
    this.enemyPaddle.step(t);

    const scene = new THREE.Scene();
    scene.add(this.enemyPaddle.object());
    scene.add(this.playerPaddle.object());
    this.renderer.render(scene, this.camera);
  }
}

window.addEventListener('load', () => {
  window.game = new Game();
});
