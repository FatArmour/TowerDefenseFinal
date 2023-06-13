class Hero {
  constructor({ position = { x: 0, y: 0 } }, enemy) {
    this.position = position;
    this.enemy = enemy;
    this.width = 50;
    this.height = 50;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.health = 1500;
    this.attackRadius = 150;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.position.x + this.width / 2, // Center x-coordinate
      this.position.y + this.height / 2, // Center y-coordinate
      this.attackRadius,
      0,
      2 * Math.PI
    );
    context.fillStyle = "rgba(211,211,211, 0.3)";
    context.fill();

    context.beginPath();
    context.arc(
      this.position.x + this.width / 2, // Center x-coordinate
      this.position.y + this.height / 2, // Center y-coordinate
      this.width / 2, // Radius is half the width
      0,
      2 * Math.PI
    );
    context.fillStyle = "blue";
    context.fill();

    context.fillStyle = "red";
    context.fillRect(
      this.center.x - this.width / 2,
      this.center.y - 40,
      this.width,
      10
    );

    context.fillStyle = "green";
    context.fillRect(
      this.center.x - this.width / 2,
      this.center.y - 40,
      this.width,
      10
    );
  }

  heroMove(event) {
    if (
      event.code == "ArrowRight" &&
      this.position.x < canvas.width - this.width
    ) {
      this.position.x += 10;
      this.center.x += 10;
    } else if (event.code == "ArrowLeft" && this.position.x > 0) {
      this.position.x += -10;
      this.center.x -= 10;
    } else if (event.code == "ArrowUp" && this.position.y > 0) {
      this.position.y += -10;
      this.center.y -= 10;
    } else if (
      event.code == "ArrowDown" &&
      this.position.y < canvas.height - this.height
    ) {
      this.position.y += 10;
      this.center.y += 10;
    } else if (event.code == "Space") {
      this.heroAttack();
    }
  }

  heroAttack() {
    const xDifference = this.enemy.center.x - this.center.x;
    const yDifference = this.enemy.center.y - this.center.y;
    const distance = Math.hypot(xDifference, yDifference);

    if (distance < this.attackRadius + this.enemy.radius) {
      this.enemy.health -= 20;

      if (this.enemy.health <= 0) {
        // Remove the defeated enemy
        const enemyIndex = enemies.indexOf(this.enemy);
        if (enemyIndex > -1) {
          enemies.splice(enemyIndex, 1);
          coins += 25;
          document.querySelector("#coins").innerHTML = coins;
        }
      }
    }
  }

  update() {
    this.draw();
  }
}

const enemy = new Enemy({ position: { x: 100, y: 100 } });
const hero = new Hero({ position: { x: 100, y: 100 } }, enemy);

// Add event listener to the document
document.addEventListener("keydown", keydownHandler);

// Event handler function
function keydownHandler(event) {
  hero.heroMove(event);
}
