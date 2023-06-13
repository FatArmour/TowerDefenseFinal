const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let waveCount = 1;

canvas.width = 1280;
canvas.height = 768;

context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 43) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64,
          },
        })
      );
    }
  });
});

const image = new Image();

image.onload = () => {
  animate();
};
image.src = "img/TowerDefenseMap1.png";

const enemies = [];

function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    const enemyHealth = 100 + (waveCount - 1) * 10; // Increase enemy health per wave
    enemies.push(
      new Enemy({
        position: { x: wayPoints[0].x - xOffset, y: wayPoints[0].y },
        health: enemyHealth, // Set the enemy health
      })
    );
  }
}

const buildings = [];
let activeTile = undefined;

let enemyCount = 3;
let hearts = 10;
let coins = 100;

spawnEnemies(enemyCount);

function animate() {
  const animationId = requestAnimationFrame(animate);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  enemies.forEach((enemy) => {
    enemy.update();
  });

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  hero.update();
  hero.heroAttack();

  buildings.forEach((building) => {
    building.update();
    building.updateHover(mouse);

    // Enemy targeting
    building.target = null;
    // shootable enemies, is it in tower range
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;
      const distance = Math.hypot(xDifference, yDifference);
      return distance < enemy.radius + building.radius;
    });
    building.target = validEnemies[0];

    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];

      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;
      const distance = Math.hypot(xDifference, yDifference);

      // this is when a projectile hits an enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        // enemy health and enemy removal
        projectile.enemy.health -= 20;
        building.projectiles.splice(i, 1);
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });

          // remove enemy + add money
          if (enemyIndex > -1) {
            enemies.splice(enemyIndex, 1);
            coins += 25;
            document.getElementById("coins").innerHTML = coins;
          }
        }
      }
    }
  });

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();

    if (enemy.position.y + enemy.height < 0) {
      hearts -= 1;
      enemies.splice(i, 1);
      document.getElementById("hearts").innerHTML = hearts;

      if (hearts === 0) {
        cancelAnimationFrame(animationId);
        document.getElementById("gameOver").style.display = "flex";
      }
    }
  }

  // tracking total amount of enemies
  if (enemies.length === 0) {
    enemyCount += 2;
    waveCount++;

    if (waveCount === 20) {
      cancelAnimationFrame(animationId);
      document.getElementById("gameWon").style.display = "flex";
      document.getElementById("gameWon").innerHTML = "You Won!";
      return;
    }

    spawnEnemies(enemyCount);
  }

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });
}

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied && coins - 50 >= 0) {
    coins -= 50;
    document.getElementById("coins").innerHTML = coins;
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
    buildings.sort((a, b) => {
      return a.position.y - b.position.y;
    });
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
