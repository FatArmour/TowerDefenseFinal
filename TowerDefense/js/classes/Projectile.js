class Projectile {
  constructor({ position = { x: 0, y: 0 }, enemy }) {
    this.position = position;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 10;
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "green";
    context.fill();
  }

  update() {
    this.draw(); // Call the draw() method to render the projectile

    const angle = Math.atan2(
      // distance on y axis
      this.enemy.center.y - this.position.y,
      // distance on x axis
      this.enemy.center.x - this.position.x
    );

    this.velocity.x = Math.cos(angle);
    this.velocity.y = Math.sin(angle);

    const projectileSpeed = 3;
    const velocityX = Math.cos(angle) * projectileSpeed;
    const velocityY = Math.sin(angle) * projectileSpeed;

    this.position.x += velocityX;
    this.position.y += velocityY;
  }
}
