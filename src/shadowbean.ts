import { Bean } from "./bean";
import settings from "./settings.json";

class PlayerBean implements Bean {
  id: number;
  isDead: boolean = false;
  deadStep: number = 0;
  name: string;
  isLocal: boolean = false;
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

    this.x += this.velX;
    this.y += this.velY;
  }
  updateMovement(x: number, y: number, velX: number, velY: number) {
    this.x = x;
    this.y = x;
    this.velX = velX;
    this.velY = velY;
  }
}