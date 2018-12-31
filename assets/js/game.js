const WIDTH = 480;
const HEIGHT = 320;

const PADDLE_MOUSE_X_SCALE = 0.6;
const PADDLE_MOUSE_Y_SCALE = 0.4;

class Game {
  constructor() {
    this.reset();

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
    this.ball.step(t);
    this.playerPaddle.step(t);
    this.enemyPaddle.step(t);

    this.enemyPaddle.setPosition(
      aiMotion(this.enemyPaddle.x, this.ball.x, t / 1.2),
      aiMotion(this.enemyPaddle.y, this.ball.y, t / 1.2),
    );

    this.tunnel.bounceBall(this.ball);
    this.playerPaddle.bounceBall(this.ball);
    this.enemyPaddle.bounceBall(this.ball);
    // TODO: bounce against paddles.

    if (this.roundOver()) {
      this.reset();
    }

    const scene = new THREE.Scene();
    scene.add(this.ball.object());
    scene.add(this.enemyPaddle.object());
    scene.add(this.playerPaddle.object());
    scene.add(this.tunnel.object());

    var light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 10);
    scene.add(light);

    this.renderer.render(scene, this.camera);
  }

  gotMotion() {
    if (this.ball.stopped()) {
      const vel = new THREE.Vector2(this.playerPaddle.x, this.playerPaddle.y);
      vel.normalize();
      this.ball.vx = vel.x;
      this.ball.vy = vel.y;
      this.ball.vz = -2;
    }
  }

  roundOver() {
    return this.ball.z > -1 - BALL_RADIUS || this.ball.z < TUNNEL_DEPTH + BALL_RADIUS;
  }

  reset() {
    this.ball = new Ball();
    this.playerPaddle = new Paddle(-1.0);
    this.enemyPaddle = new Paddle(TUNNEL_DEPTH);
    this.tunnel = new Tunnel();
  }

  _animationFrame(t) {
    this.step((t - this._lastTime) / 1000);
    this._lastTime = t;
    window.requestAnimationFrame((t) => this._animationFrame(t));
  }

  _setupMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      const el = this.renderer.domElement;
      const box = el.getBoundingClientRect();
      const x = PADDLE_MOUSE_X_SCALE * (2 * (e.clientX - box.left) / el.offsetWidth - 1);
      const y = PADDLE_MOUSE_Y_SCALE * (1 - 2 * (e.clientY - box.top) / el.offsetHeight);
      this.playerPaddle.setPosition(x, y);
      this.gotMotion();
    });
  }
}

function aiMotion(point, ballPoint, t) {
  let delta = ballPoint - point;
  if (delta > t) {
    delta = t;
  } else if (delta < -t) {
    delta = -t;
  }
  return point + delta;
}

window.addEventListener('load', () => {
  window.game = new Game();
});
