
export interface Bean {
  id: number;
  isDead: boolean;
  deadStep: number;
  name: string;
  isLocal: boolean;
  isImposter: boolean;
  x: number;
  y: number;
  velX: number;
  velY: number;
  size: number;
  isFacingLeft: boolean;
  xSpeed: number;
  ySpeed: number;
  isMoving: boolean;
  update(): void;
}
/**

 // constructor(name:string, isLocal:boolean, isImposter:boolean, x:number, y:number) {
  this.id = -1; // -1 = not assigned, 0-11 = assigned
  this.isDead = false;
  this.deadStep = 0;
  players.push(this);
  this.name = name;
  this.isLocal = isLocal;
  this.isImposter = isImposter;
  this.x = this.wasX = this.seekX = x;
  this.y = this.wasY = this.seekX = y;
  this.size = 15; // Size
  this.col = beanColors[this.id];
  this.colName = beanNames[this.id];
  this.facingEast = true;
  this.xSpeed = 2.5; // Speed in the X direction
  this.ySpeed = this.xSpeed * 0.88; // Speed in the Y direction
  this.mouseRangeSlowdown = 50; // For smooth mouse controls
  this.speedMultiplier = 1; // For player control
  this.isMoving = false; // Read-only
  this.alreadyCollided = false; // For collision physics
  this.sees = []; // For partial visibility for humans and voting logic for AI
  this.notSees = [];
  this.nearbyColliders = []; // For optimization
  if (isImposter) {
    this.killTimer = this.killTimerReset = 10; // In seconds
    this.killRange = 40; // In game coordinates
  }
  this.reportRange = 40;
};
Bean.prototype.localControls = function() {
  // Key controls
  this.speedMultiplier = 0;
  if (keys[LEFT] || keys[65]) {
    this.speedMultiplier = 1;
    this.seekX = this.x - 1;
  } else if (keys[RIGHT] || keys[68]) {
    this.speedMultiplier = 1;
    this.seekX = this.x + 1;
  }
  if (keys[UP] || keys[87]) {
    this.speedMultiplier = 1;
    this.seekY = this.y - 1;
  } else if (keys[DOWN] || keys[83]) {
    this.speedMultiplier = 1;
    this.seekY = this.y + 1;
  }

  // Mouse controls
  if (mouseIsPressed && mouseButton === LEFT && !UIManager.isMouseHoverAny) {
    this.speedMultiplier = 1;
    this.seekX = gMouseX;
    this.seekY = gMouseY;
    var mouseMag = Math.sqrt(sq(mouseX - X(this.x)) + sq(mouseY - Y(this.y)));
    if (mouseMag < this.mouseRangeSlowdown) {
      this.speedMultiplier = mouseMag / this.mouseRangeSlowdown;
    }
  }

};
Bean.prototype.update = function() {
  if (this.isDead) return;

  // Movement
  this.speedMultiplier = 1;
  this.alreadyCollided = false;
  this.wasX = this.x;
  this.wasY = this.y;
  this.seekX = this.x;
  this.seekY = this.y;

  // Change velX and velY
  if (this.isLocal) {
    this.localControls();
  }

  // More movement code
  this.isMoving = (this.seekX !== this.x || this.seekY !== this.y);
  var velX = this.seekX - this.x;
  var velY = this.seekY - this.y;
  if (velX || velY) {
    if (velX < 0) {
      this.facingEast = false;
    }
    if (velX > 0) {
      this.facingEast = true;
    }
    var mag = Math.sqrt(sq(velX) + sq(velY));
    velX *= this.xSpeed / mag;
    velY *= this.ySpeed / mag;
    this.x += velX * this.speedMultiplier;
    this.y += velY * this.speedMultiplier;
  }

  // Find nearby colliders for optimized collisions
  this.nearbyColliders = [];
  for (var i = 0; i < colliders.length; i += 1) {
    var w = colliders[i];
    var hGLOS = 100;
    if (
      (abs(w.x1 - this.x) < hGLOS && abs(w.y1 - this.y) < hGLOS) ||
      (abs(w.x2 - this.x) < hGLOS && abs(w.y2 - this.y) < hGLOS)) {
      this.nearbyColliders.push(w);
    }
  }

  // Update player-player visibility (PPV)
  this.sees = [];
  this.notSees = [];
  for (var i = 0; i < players.length; i++) {
    var isIntersection = false;
    var p = players[i];
    if (p === this) { // If player is myself, ignore
      continue;
    }
    if (abs(p.x - this.x) > globalLOS || abs(p.y - this.y) > globalLOS) { // If player is "off-screen", consider it not seen
      this.notSees.push(p);
      continue;
    }
    for (var j = 0; j < this.nearbyColliders.length; j++) {
      // Thanks to everyone in the KACC discord server for helping me figure this out 
      var w = this.nearbyColliders[j]; // w for collider (wall)
      isIntersection = isLineLineIntersect(w.x1, w.y1, w.x2, w.y2, this.x, this.y, p.x, p.y);
      if (isIntersection) { // If wall blocks line of sight
        this.notSees.push(p);
        break;
      }
    }
    if (!isIntersection) {
      this.sees.push(p);
    }
  }

  // Imposter logic
  if (this.isImposter) {
    this.killTimer -= 1 / 60;
  }
};
Bean.prototype.draw = function() {
  // Drawing
  if (this.isDead) {   
    drawCharacterBody(X(this.x), Y(this.y), S(this.s), this.col, this.deadStep++);
    return;      
  }

  // Calculate player position
  var x = X(this.x);
  var y = Y(this.y);
  var s = S(this.s);
  if (x < -50 || x > width + 50 || y < -50 || y > height + 50) {// If player is off-screen, ignore
    return;
  }

  // Calculate bobbing animation when walking
  var cycle = 0;
  var walkY = 0;
  if (this.isMoving) {
    walkY = (1 - cos(radians(frameCount * 360 / 20))) * this.s / 12;
    cycle = floor(frameCount / 5) % 4;
  }

  // Shadow
  fill(0, 100);
  ellipse(x, y + s * 0.35, s * 0.95, s * 0.25);

  // Draw bean
  drawCharacter(x, y - S(this.s / 4 + walkY), s / 60, !this.facingEast, this.id, cycle);

  // Show PPV (player-player visibility) if in debug mode
  if (debugMode) {
    stroke(255);
    strokeWeight(1);
    for (var i = 0; i < this.sees.length; i++) {
      fill(this.sees[i].col);
      ellipse(x + i * 10 - this.sees.length * 5 + 5, y - S(this.s), 10, 10);
    }
    noStroke();
  }
};
Bean.prototype.drawName = function() {
  // Draw name above player
  var x = X(this.x);
  var y = Y(this.y);
  var s = S(this.s);
  fill(0);
  var yPos = y - s * 1.2;
  text(this.name, x-1, yPos+1);
  text(this.name, x-1, yPos-1);
  text(this.name, x+1, yPos-1);
  text(this.name, x+1, yPos+1);
  if (this.isImposter) {
    fill(255, 0, 0);
  } else {
    fill(255);
  }
  text(this.name, x, yPos);
}
Bean.prototype.lineOfSight = function() {
  // Credit to Jent @iforgothisusername /// 
  if (debugMode) {
    stroke(0, 50);
    fill(5, 5, 10, 50);
  } else {
    fill(5, 5, 10);
  }
  noStroke();

  for (let room of rooms) {
    for (let wall of room.walls) {
      for (let i = 0; i < wall.length - 1; i++) {

        var left = wall[i];
        var right = wall[i + 1];
        quad(
          X(left.x), Y(left.y),
          X(right.x), Y(right.y),
          X(this.x + (right.x - this.x) * 100), Y(this.y + (right.y - this.y) * 100),
          X(this.x + (left.x - this.x) * 100), Y(this.y + (left.y - this.y) * 100)
        );
      }

    }
  }
};**/