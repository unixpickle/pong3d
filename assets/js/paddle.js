PADDLE_WIDTH = 0.3;
PADDLE_HEIGHT = 0.2;

class Paddle {
  constructor(z) {
    this.x = 0;
    this.y = 0;
    this.z = z;
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
}
