class Building {
  constructor({
    position = { x: 0, y: 0 },
    frames = { current: 0, elapsed: 0, hold: 0 },
  }) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.projectiles = [];
    this.radius = 250;
    this.target;
    this.frames = 0;
  }

  draw() {
    context.fillStyle = "blue";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  drawHover() {
    context.beginPath();
    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255, 0, 0, 0.5)";
    context.lineWidth = 2;
    context.stroke();
  }

  update() {
    this.draw();
    // this.target exists
    if (this.frames % 50 === 0 && this.target) {
      this.projectiles.push(
        new Projectile({
          position: { x: this.center.x, y: this.center.y },
          enemy: this.target,
        })
      );
    }

    this.frames++;

    if (this.target || (!this.target && this.frames.current !== 0)) {
      // Perform any additional logic or actions here if needed
    }

    if (
      this.target &&
      this.frames.current === 6 &&
      this.frames.elapsed % this.frames.hold === 0
    ) {
      this.shoot();
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update();

      if (
        projectile.position.x > canvas.width ||
        projectile.position.y > canvas.height
      ) {
        // Remove projectiles that are off-screen
        this.projectiles.splice(i, 1);
      }
    }
  }

  shoot() {
    this.projectiles.push(
      new Projectile({
        position: {
          x: this.center.x - 20,
          y: this.center.y - 110,
        },
        enemy: this.target,
      })
    );
  }

  updateHover(mouse) {
    if (
      mouse.x > this.position.x &&
      mouse.x < this.position.x + this.width &&
      mouse.y > this.position.y &&
      mouse.y < this.position.y + this.height
    ) {
      this.drawHover();
    }
  }
}
