import { Bean } from "./bean";
import settings from "./settings.json";

class PlayerBean implements Bean {
  id: number;
  isDead: boolean = false;
  deadStep: number = 0;
  name: string;
  isLocal: boolean = true;
  isImposter: boolean;
  x: number;
  y: number;
  velX: number;
  velY: number;
  isFacingLeft: boolean;
  size: number = settings.BEAN_SIZE;
  xSpeed: number = settings.BEAN_SPEED_X;
  ySpeed: number = settings.BEAN_SPEED_Y; 
  isMoving: boolean;

  seekX: number;
  seekY: number;
  speedMultiplier: number;
  constructor(name:string, isImposter:boolean, x:number, y:number) {
    name = name;
    isImposter = isImposter;
    x = x;
    y = y;
  };
  update() {
    if (this.isDead) {
      this.deadStep ++;
      return;
    };


  }
  mouseControl(mouseX: number, mouseY: number) {
   // if (!UIManager.isMouseHoverAny) {
      this.speedMultiplier = 1;
      this.seekX = gMouseX;
      this.seekY = gMouseY;
      var mouseMag = Math.sqrt(sq(mouseX - X(this.x)) + sq(mouseY - Y(this.y)));
      if (mouseMag < this.mouseRangeSlowdown) {
        this.speedMultiplier = mouseMag / this.mouseRangeSlowdown;
      }
    //}
  }
  keyControl(keys: Object) {
    if (keys[37] || keys[65]) {
      this.speedMultiplier = 1;
      this.seekX = this.x - 1;
    } else if (keys[39] || keys[68]) {
      this.speedMultiplier = 1;
      this.seekX = this.x + 1;
    }
    if (keys[38] || keys[87]) {
      this.speedMultiplier = 1;
      this.seekY = this.y - 1;
    } else if (keys[40] || keys[83]) {
      this.speedMultiplier = 1;
      this.seekY = this.y + 1;
    }
  }
  draw() {

  }
}