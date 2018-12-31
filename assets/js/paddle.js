const PADDLE_WIDTH = 0.3;
const PADDLE_HEIGHT = 0.2;
const PADDLE_MAX_X = 0.475;
const PADDLE_MAX_Y = 0.315;

class Paddle {
  constructor(z) {
    this.x = 0;
    this.y = 0;
    this.z = z;
  }

  setPosition(x, y) {
    this.x = Math.min(Math.max(-PADDLE_MAX_X, x), PADDLE_MAX_X);
    this.y = Math.min(Math.max(-PADDLE_MAX_Y, y), PADDLE_MAX_Y);
  }

  step(t) {
    // TODO: this.
  }

  object() {
    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(this.x - PADDLE_WIDTH / 2, this.y - PADDLE_HEIGHT / 2, this.z),
      new THREE.Vector3(this.x - PADDLE_WIDTH / 2, this.y + PADDLE_HEIGHT / 2, this.z),
      new THREE.Vector3(this.x + PADDLE_WIDTH / 2, this.y + PADDLE_HEIGHT / 2, this.z),
      new THREE.Vector3(this.x + PADDLE_WIDTH / 2, this.y - PADDLE_HEIGHT / 2, this.z),
    );
    geometry.faces.push(
      new THREE.Face3(2, 1, 0),
      new THREE.Face3(0, 3, 2),
    );
    geometry.computeBoundingSphere();

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.5,
    });

    return new THREE.Mesh(geometry, material);
  }

  bounceBall(ball) {
    if (ball.x >= this.x - PADDLE_WIDTH / 2 && ball.x <= this.x + PADDLE_WIDTH / 2) {
      if (ball.y >= this.y - PADDLE_HEIGHT / 2 && ball.y <= this.y + PADDLE_HEIGHT / 2) {
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
  }
}
