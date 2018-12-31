const WIDTH = 480;
const HEIGHT = 320;

const PADDLE_MAX_X = 0.475;
const PADDLE_MAX_Y = 0.315;
const PADDLE_MOUSE_X_SCALE = 0.6;
const PADDLE_MOUSE_Y_SCALE = 0.4;

class Game {
  constructor() {
    this.playerPaddle = new Paddle(-1.0);
    this.enemyPaddle = new Paddle(-10.0);

    this.camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.domElement.id = 'game-container';
    document.body.appendChild(this.renderer.domElement);

    this._lastTime = performance.now();
    window.requestAnimationFrame((t) => this._animationFrame(t));

    this._setupMouseEvents();
  }

  step(t) {
    this.playerPaddle.step(t);
    this.enemyPaddle.step(t);

    const scene = new THREE.Scene();
    scene.add(this.enemyPaddle.object());
    scene.add(this.playerPaddle.object());
    this.renderer.render(scene, this.camera);
  }

  _animationFrame(t) {
    this.step(t - this._lastTime);
    this._lastTime = t;
    window.requestAnimationFrame((t) => this._animationFrame(t));
  }

  _setupMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      const el = this.renderer.domElement;
      const box = el.getBoundingClientRect();
      const x = PADDLE_MOUSE_X_SCALE * (2 * (e.clientX - box.left) / el.offsetWidth - 1);
      const y = PADDLE_MOUSE_Y_SCALE * (1 - 2 * (e.clientY - box.top) / el.offsetHeight);
      this.playerPaddle.x = Math.min(Math.max(-PADDLE_MAX_X, x), PADDLE_MAX_X);
      this.playerPaddle.y = Math.min(Math.max(-PADDLE_MAX_Y, y), PADDLE_MAX_Y);
    });
  }
}

window.addEventListener('load', () => {
  window.game = new Game();
});
