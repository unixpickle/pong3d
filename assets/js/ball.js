const BALL_RADIUS = 0.05;

class Ball {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.z = -(1 + BALL_RADIUS);
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this._sphere = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
  }

  stopped() {
    return this.vx == 0 && this.vy == 0 && this.vz == 0;
  }

  step(t) {
    this.x += t * this.vx;
    this.y += t * this.vy;
    this.z += t * this.vz;
  }

  object() {
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00, side: THREE.DoubleSide, flatShading: true });
    const object = new THREE.Mesh(this._sphere, material);
    object.position.set(this.x, this.y, this.z);
    return object;
  }
}
