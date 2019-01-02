const PADDLE_WIDTH = 0.3;
const PADDLE_HEIGHT = 0.2;
const PADDLE_SPACE = 0.005;
const PADDLE_MAX_X = 0.475;
const PADDLE_MAX_Y = 0.315;

class Paddle {
  constructor(z) {
    this.x = 0;
    this.y = 0;
    this.z = z;

    this.hitTime = 0;
    this.hitQuadrant = 0;
  }

  setPosition(x, y) {
    this.x = Math.min(Math.max(-PADDLE_MAX_X, x), PADDLE_MAX_X);
    this.y = Math.min(Math.max(-PADDLE_MAX_Y, y), PADDLE_MAX_Y);
  }

  step(t) {
    this.hitTime -= t;
  }

  object() {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(this.x - PADDLE_WIDTH / 2, this.y - PADDLE_HEIGHT / 2, this.z),
      new THREE.Vector3(this.x - PADDLE_WIDTH / 2, this.y - PADDLE_SPACE, this.z),
      new THREE.Vector3(this.x - PADDLE_SPACE, this.y - PADDLE_SPACE, this.z),
      new THREE.Vector3(this.x - PADDLE_SPACE, this.y - PADDLE_HEIGHT / 2, this.z),
    );
    geometry.faces.push(
      new THREE.Face3(2, 1, 0),
      new THREE.Face3(0, 3, 2),
    );
    geometry.computeBoundingSphere();

    let objects = new THREE.Group();
    for (let y = 0; y < 2; ++y) {
      for (let x = 0; x < 2; ++x) {
        const quadrant = x + 2 * y;
        const material = new THREE.MeshBasicMaterial({
          color: 0x33aaff,
          transparent: true,
          opacity: (this.hitTime > 0 && this.hitQuadrant === quadrant
            ? 0.5 + 2 * this.hitTime
            : 0.5),
        });
        const obj = new THREE.Mesh(geometry, material);
        obj.position.set(x * (PADDLE_WIDTH / 2 + PADDLE_SPACE),
          y * (PADDLE_HEIGHT / 2 + PADDLE_SPACE), 0);
        objects.add(obj);
      }
    }

    return objects;
  }

  bounceBall(ball) {
    if (ball.x >= this.x - PADDLE_WIDTH / 2 - BALL_RADIUS &&
      ball.x <= this.x + PADDLE_WIDTH / 2 + BALL_RADIUS) {
      if (ball.y >= this.y - PADDLE_HEIGHT / 2 - BALL_RADIUS &&
        ball.y <= this.y + PADDLE_HEIGHT / 2 + BALL_RADIUS) {
        if (this.z < TUNNEL_DEPTH / 2) {
          // Back paddle.
          if (ball.z <= TUNNEL_DEPTH + BALL_RADIUS) {
            ball.z = TUNNEL_DEPTH + BALL_RADIUS;
            this._bounceBall(ball);
          }
        } else {
          // Front paddle.
          if (ball.z >= -1 - BALL_RADIUS) {
            ball.z = -1 - BALL_RADIUS;
            this._bounceBall(ball);
          }
        }
      }
    }
  }

  _bounceBall(ball) {
    const vel = new THREE.Vector2(ball.x - this.x, ball.y - this.y);
    vel.normalize();
    ball.vx = vel.x;
    ball.vy = vel.y;
    ball.vz *= -1;
    this.hitTime = 0.25;

    let x = 0;
    let y = 0;
    if (ball.x > this.x) {
      x = 1;
    }
    if (ball.y > this.y) {
      y = 1;
    }
    this.hitQuadrant = x + 2 * y;
  }
}
