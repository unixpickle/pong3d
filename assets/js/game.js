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
    this.renderer.setClearColor(0x4d2c5b, 1);
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
    this._setupKeyEvents();
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

    this._keyUpdatePaddle(t);
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
    const obj = this.object();
    scene.add(obj.object);

    var light = new THREE.PointLight(0xffffff, 1);
    light.position.set(0, 0, 10);
    scene.add(light);

    this.renderer.render(scene, this.camera);

    obj.dispose();
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

  object() {
    const children = [this.ball, this.enemyPaddle, this.playerPaddle, this.tunnel];
    const group = new THREE.Group();
    const disposes = [];
    children.forEach((c) => {
      const obj = c.object();
      group.add(obj.object);
      disposes.push(obj.dispose);
    });
    return {
      object: group,
      dispose: () => {
        disposes.forEach((f) => f());
      },
    };
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

  _setupKeyEvents() {
    const KEY_LEFT = 37;
    const KEY_UP = 38;
    const KEY_RIGHT = 39;
    const KEY_DOWN = 40;
    this._keyDelta = new THREE.Vector2(0, 0);
    const codeDelta = (code) => {
      const res = {};
      res[KEY_LEFT] = new THREE.Vector2(-1, 0);
      res[KEY_RIGHT] = new THREE.Vector2(1, 0);
      res[KEY_DOWN] = new THREE.Vector2(0, -1);
      res[KEY_UP] = new THREE.Vector2(0, 1);
      return res[code.toString()] || new THREE.Vector2(0, 0);
    };
    const clipDelta = () => {
      this._keyDelta.x = Math.min(Math.max(this._keyDelta.x, -1), 1);
      this._keyDelta.y = Math.min(Math.max(this._keyDelta.y, -1), 1);
    };
    window.addEventListener('keydown', (e) => {
      this._keyDelta.add(codeDelta(e.which));
      clipDelta();
    });
    window.addEventListener('keyup', (e) => {
      this._keyDelta.sub(codeDelta(e.which));
      clipDelta();
    });
  }

  _keyUpdatePaddle(t) {
    this.playerPaddle.setPosition(this.playerPaddle.x + this._keyDelta.x * t,
      this.playerPaddle.y + this._keyDelta.y * t);
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
