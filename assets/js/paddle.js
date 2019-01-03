const PADDLE_WIDTH = 0.3;
const PADDLE_HEIGHT = 0.2;
const PADDLE_SPACE = 0.005;
const PADDLE_MAX_X = 0.475;
const PADDLE_MAX_Y = 0.315;

class Paddle {
  constructor(z) {
    this.z = z;
    this.x = this.y = 0;

    // Used for lighting up part of the paddle after the
    // ball hits it.
    this.hitTime = 0;
    this.hitQuadrant = 0;

    this.meshes = makePaddleMeshes();
    this.object = new THREE.Group();
    this.meshes.forEach((x) => this.object.add(x));
  }

  reset() {
    this.setPosition(0, 0);
  }

  setPosition(x, y) {
    this.x = Math.min(Math.max(-PADDLE_MAX_X, x), PADDLE_MAX_X);
    this.y = Math.min(Math.max(-PADDLE_MAX_Y, y), PADDLE_MAX_Y);
  }

  step(t) {
    this.hitTime -= t;
    this.meshes.forEach((x, i) => {
      x.position.set(this.x, this.y, this.z);
      if (this.hitQuadrant == i && this.hitTime > 0) {
        x.material.opacity = 0.5 + this.hitTime * 2;
      } else {
        x.material.opacity = 0.5;
      }
    });
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

function makePaddleMeshes() {
  const vecs = [
    new THREE.Vector3(-PADDLE_WIDTH / 2, -PADDLE_HEIGHT / 2, 0),
    new THREE.Vector3(-PADDLE_WIDTH / 2, -PADDLE_SPACE, 0),
    new THREE.Vector3(-PADDLE_SPACE, -PADDLE_SPACE, 0),
    new THREE.Vector3(-PADDLE_SPACE, -PADDLE_HEIGHT / 2, 0),
  ];
  const meshes = [];
  for (let y = 0; y < 2; ++y) {
    for (let x = 0; x < 2; ++x) {
      const geometry = new THREE.Geometry();
      geometry.faces.push(
        new THREE.Face3(2, 1, 0),
        new THREE.Face3(0, 3, 2),
      );
      vecs.forEach((vec) => {
        geometry.vertices.push(vec.clone().add(new THREE.Vector3(
          x * (PADDLE_WIDTH / 2 + PADDLE_SPACE),
          y * (PADDLE_HEIGHT / 2 + PADDLE_SPACE),
          0,
        )));
      });
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
      });
      meshes.push(new THREE.Mesh(geometry, material));
    }
  }
  return meshes;
}
