const WIDTH = 480;
const HEIGHT = 320;

const PADDLE_MOUSE_X_SCALE = 0.63;
const PADDLE_MOUSE_Y_SCALE = 0.425;

const AI_SLOWDOWN = 1.5;

class Game {
  constructor() {
    this.reset();

    this.camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(WIDTH, HEIGHT);
    this.renderer.domElement.id = 'game-container';
    document.body.appendChild(this.renderer.domElement);

    this.overlay = document.createElement('div');
    this.overlay.id = 'overlay';
    this.overlay.onclick = () => this.start();
    document.body.appendChild(this.overlay);

    this.lastTime = performance.now();
    window.requestAnimationFrame((t) => this._animationFrame(t));

    this.stopped = true;
    this.stop();
    this._setupMouseEvents();
  }

  stop() {
    this.stopped = true;
    this.overlay.style.display = 'block';
  }

  start() {
    this.reset();
    this.stopped = false;
    this.overlay.style.display = 'none';

    const vel = new THREE.Vector2(Math.random() - 0.5, Math.random() - 0.5);
    vel.normalize();
    this.ball.vx = vel.x * 0.2;
    this.ball.vy = vel.y * 0.2;
    this.ball.vz = -2;
  }

  step(t) {
    if (this.stopped) {
      return;
    }

    this.ball.step(t);
    this.playerPaddle.step(t);
    this.enemyPaddle.step(t);
    this.tunnel.setBallZ(this.ball.z);

    this.enemyPaddle.setPosition(
      aiMotion(this.enemyPaddle.x, this.ball.x, t),
      aiMotion(this.enemyPaddle.y, this.ball.y, t),
    );

    this.tunnel.bounceBall(this.ball);
    this.playerPaddle.bounceBall(this.ball);
    this.enemyPaddle.bounceBall(this.ball);

    if (this.roundOver()) {
      this.stop();
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

  playerWins() {
    return this.ball.z < TUNNEL_DEPTH + BALL_RADIUS;
  }

  enemyWins() {
    return this.ball.z > -1 - BALL_RADIUS;
  }

  roundOver() {
    return this.playerWins() || this.enemyWins();
  }

  reset() {
    this.ball = new Ball();
    this.playerPaddle = new Paddle(-1.0);
    this.enemyPaddle = new Paddle(TUNNEL_DEPTH);
    this.tunnel = new Tunnel();
  }

  _animationFrame(t) {
    this.step((t - this.lastTime) / 1000);
    this.lastTime = t;
    window.requestAnimationFrame((t) => this._animationFrame(t));
  }

  _setupMouseEvents() {
    window.addEventListener('mousemove', (e) => {
      const el = this.renderer.domElement;
      const box = el.getBoundingClientRect();
      const x = PADDLE_MOUSE_X_SCALE * (2 * (e.clientX - box.left) / el.offsetWidth - 1);
      const y = PADDLE_MOUSE_Y_SCALE * (1 - 2 * (e.clientY - box.top) / el.offsetHeight);
      this.playerPaddle.setPosition(x, y);
    });
  }
}

function aiMotion(point, ballPoint, t) {
  let delta = ballPoint - point;
  if (delta > t / AI_SLOWDOWN) {
    delta = t / AI_SLOWDOWN;
  } else if (delta < -t / AI_SLOWDOWN) {
    delta = -t / AI_SLOWDOWN;
  }
  return point + delta;
}

window.addEventListener('load', () => {
  window.game = new Game();
});
