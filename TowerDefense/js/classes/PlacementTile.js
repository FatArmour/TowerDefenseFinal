class PlacementTile {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.size = 64;
    this.color = "rgba(2, 222, 222, .15)";
    this.occupied = false;
  }

  draw() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }

  update(mouse) {
    this.draw();

    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.size
    ) {
      this.color = "rgba(222, 2, 2, .15)";
    } else this.color = "rgba(2, 222, 222, .15)";
  }
}
