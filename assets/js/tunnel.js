const TUNNEL_WIDTH = 0.625;
const TUNNEL_HEIGHT = 0.415;
const TUNNEL_DEPTH = -7;

class Tunnel {
  constructor() {
    this.sides = makeTunnelSides();
    this.topBottom = makeTunnelTopBottom();
    this._object = new THREE.Group();
    this._object.add(this.sides);
    this._object.add(this.topBottom);
  }

  object() {
    return this._object;
  }

  bounceBall(ball) {
    if (ball.x < -TUNNEL_WIDTH + BALL_RADIUS) {
      ball.x = -TUNNEL_WIDTH + BALL_RADIUS;
      ball.vx *= -1;
    } else if (ball.x > TUNNEL_WIDTH - BALL_RADIUS) {
      ball.x = TUNNEL_WIDTH - BALL_RADIUS;
      ball.vx *= -1;
    }
    if (ball.y < -TUNNEL_HEIGHT + BALL_RADIUS) {
      ball.y = -TUNNEL_HEIGHT + BALL_RADIUS;
      ball.vy *= -1;
    } else if (ball.y > TUNNEL_HEIGHT - BALL_RADIUS) {
      ball.y = TUNNEL_HEIGHT - BALL_RADIUS;
      ball.vy *= -1;
    }
  }
}

function makeTunnelSides() {
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-TUNNEL_WIDTH, -TUNNEL_HEIGHT, -1),
    new THREE.Vector3(-TUNNEL_WIDTH, -TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(-TUNNEL_WIDTH, TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(-TUNNEL_WIDTH, TUNNEL_HEIGHT, -1),

    new THREE.Vector3(TUNNEL_WIDTH, -TUNNEL_HEIGHT, -1),
    new THREE.Vector3(TUNNEL_WIDTH, -TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, TUNNEL_HEIGHT, -1),
  );
  geometry.faces.push(
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(2, 3, 0),
    new THREE.Face3(6, 5, 4),
    new THREE.Face3(4, 7, 6),
  );
  geometry.computeBoundingSphere();

  const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });

  return new THREE.Mesh(geometry, material);
}

function makeTunnelTopBottom() {
  geometry = new THREE.Geometry();
  geometry.vertices.push(
    new THREE.Vector3(-TUNNEL_WIDTH, -TUNNEL_HEIGHT, -1),
    new THREE.Vector3(-TUNNEL_WIDTH, -TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, -TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, -TUNNEL_HEIGHT, -1),

    new THREE.Vector3(-TUNNEL_WIDTH, TUNNEL_HEIGHT, -1),
    new THREE.Vector3(-TUNNEL_WIDTH, TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, TUNNEL_HEIGHT, TUNNEL_DEPTH),
    new THREE.Vector3(TUNNEL_WIDTH, TUNNEL_HEIGHT, -1),
  );
  geometry.faces.push(
    new THREE.Face3(2, 1, 0),
    new THREE.Face3(0, 3, 2),
    new THREE.Face3(4, 5, 6),
    new THREE.Face3(6, 7, 4),
  );
  geometry.computeBoundingSphere();

  const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });

  return new THREE.Mesh(geometry, material);
}
