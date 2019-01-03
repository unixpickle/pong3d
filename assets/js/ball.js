const BALL_RADIUS = 0.05;

class Ball {
  constructor() {
    this.reset();
    const geometry = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    this.object = new THREE.Mesh(geometry, material);
  }

  stopped() {
    return this.vx == 0 && this.vy == 0 && this.vz == 0;
  }

  reset() {
    this.x = this.y = this.vx = this.vy = this.vz = 0;
    this.z = -(1 + BALL_RADIUS);
  }

  step(t) {
    this.x += t * this.vx;
    this.y += t * this.vy;
    this.z += t * this.vz;
    this.object.position.set(this.x, this.y, this.z);
  }
}
