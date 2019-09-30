import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { I18nSelectPipe } from '@angular/common';

@Component({
  selector: 'app-brick-box',
  templateUrl: './brick-box.component.html',
  styleUrls: ['./brick-box.component.scss']
})
export class BrickBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('parentDiv', { static: false })
  private _parentDiv: ElementRef;

  @ViewChild('brickGameCanvas', { static: false })
  private _brickGameCanvas: ElementRef;

  @ViewChild('brickGameScoreDiv', { static: false })
  private _brickGameScoreCanvas: ElementRef;

  private _canvasContext: CanvasRenderingContext2D;

  readonly ballSpeedIncrease = 1.02;
  readonly ballSpeed = 7;
  readonly ballRadius = 25;
  readonly racketSpeed = 25;
  readonly racketSize = 250;
  readonly racketCurveCoef = 0.1;
  readonly brickHeight = 50;
  readonly brickLines = 8;
  readonly brickMinWidth = 100;
  readonly brickValue = 50;
  readonly color = ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350'];


  private canvasWidth: number;
  private canvasHeight: number;
  private racketX: number;
  private racketY: number;
  private bricks: Brick[] = [];
  private ball: Ball;

  private score: number = 0;
  private ballSound: HTMLAudioElement;
  private ballSoundDown: HTMLAudioElement;
  private ballSmash: HTMLAudioElement;
  private breakBrickSound: HTMLAudioElement;

  private brickCount: number = 0;


  constructor() { }

  ngOnInit() {
    this.breakBrickSound = new Audio('assets/sounds/brokenBrick.wav');
    this.breakBrickSound.load();
    this.ballSound = new Audio('assets/sounds/ballSound.wav');
    this.ballSound.load();
    this.ballSoundDown = new Audio('assets/sounds/ballSoundDown.wav');
    this.ballSoundDown.load();
    this.ballSmash = new Audio('assets/sounds/ballSmash.wav');
    this.ballSmash.load();
  }

  ngAfterViewInit(): void {

    let width = this._parentDiv.nativeElement.offsetWidth;
    let height = Math.round((9 / 16) * width);

    this._parentDiv.nativeElement.style.height = height + 'px';

    this._brickGameCanvas.nativeElement.height = height;
    this._brickGameCanvas.nativeElement.width = width;

    this._brickGameScoreCanvas.nativeElement.style.height = Math.round(height * 0.09) + 'px';
    this._brickGameScoreCanvas.nativeElement.style.fontSize = Math.round(height * 0.05) + 'px';
    this._brickGameScoreCanvas.nativeElement.style.width = Math.round(width * 0.2) + 'px';

    this._canvasContext = this._brickGameCanvas.nativeElement.getContext('2d');

    this.createBrickGame();

  }

  createBrickGame() {

    if (this._canvasContext) {

      this.initPositions();

      this.generateBrickArray();

      //this.initContextShadows();

      this.drawBricksNSetColor();

      this.ball = new Ball(this.canvasWidth / 2, this.canvasHeight / 2, 0, this.ballSpeed, this.ballRadius, this.ballSpeed, 'gray');

      this.drawBall(this.ball);

      this.drawRacket(this.racketX);

      this.beginGame();

    }

  }



  animate() {

    this.clearBall(this.ball);

    this.ball.x += this.ball.xDirection;
    this.ball.y += this.ball.yDirection;

    //touche mur haut/bas
    if ((this.ball.y - this.ball.radius) <= 0 || (this.ball.y + this.ball.radius) >= this.canvasHeight) {

      this.ball.yDirection = -this.ball.yDirection;
      this.ballSound.play()

      //mur haut(pts en moins)
      if ((this.ball.y + this.ball.radius) >= this.canvasHeight) {
        this.score = 0;
        this._brickGameScoreCanvas.nativeElement.classList.add('shakeItLooser');
        setTimeout(() => {
          this._brickGameScoreCanvas.nativeElement.classList.remove('shakeItLooser');
        }, 2000);
        this.ballSoundDown.play()
      }
    } else if (this.ball.x - this.ball.radius <= 0 || this.ball.x + this.ball.radius >= this.canvasWidth) {
      //touche mur gauche/droite
      this.ball.xDirection = -this.ball.xDirection;
      this.ballSound.play()

    } else if (this.ball.y + this.ball.radius >= this.racketY
      && (this.ball.x >= this.racketX - this.racketSize / 2 && this.ball.x <= this.racketX + this.racketSize / 2)) {

      //touche raquette
      this.ball.xDirection = (this.ball.x - this.racketX) * this.racketCurveCoef;
      this.ball.yDirection = -this.ball.yDirection;
      this.ballSmash.play();


    } else {
      //check touche une brique
      for (let index = 0; index < this.bricks.length; index++) {
        if (this.bricks[index]) {
          if ((this.ball.y - this.ball.radius <= this.bricks[index].y + this.bricks[index].height)
            && ((this.ball.x >= this.bricks[index].x && this.ball.x <= this.bricks[index].x + this.bricks[index].width)
              ||
              (this.ball.x - this.ball.radius <= this.bricks[index].x + this.bricks[index].width && this.ball.x - this.ball.radius >= this.bricks[index].x)
              ||
              (this.ball.x + this.ball.radius >= this.bricks[index].x && this.ball.x + this.ball.radius <= this.bricks[index].x + this.bricks[index].width)
            )) {
            this.clearBrick(this.bricks[index]);
            this.ball.color = this.bricks[index].color;
            this.ball.yDirection = -this.ball.yDirection;
            this.bricks.splice(index, 1);

            this.breakBrickSound.load();
            this.breakBrickSound.play();

            this.brickCount++;

            this.score += this.brickValue;

            //augmente la vitesse toutes les 3 briques cassées
            if (this.brickCount % 3 == 0) {
              this.ball.yDirection *= this.ballSpeedIncrease;
              console.log(this.ball.yDirection);
            }
          }
        }
      }
    }

    this.refreshScore();
    this.drawBall(this.ball);
    this.drawRacket(this.racketX);

    if (this.bricks.length > 0) {
      requestAnimationFrame(this.animate.bind(this));
    } else {
      this.endGame();
    }


  }

  beginGame() {
    let endHeight = this._brickGameScoreCanvas.nativeElement.offsetHeight * 2.2
    let endWidth = this._brickGameScoreCanvas.nativeElement.offsetWidth * 2.2

    let bottom = this._canvasContext.canvas.height / 2 - endHeight / 2
    let left = this._canvasContext.canvas.width / 2 - endWidth / 2

    //this._canvasContext.fillStyle = '#212121'
    //this._canvasContext.fillRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

    let backColor = (this.score > 0) ? '#b2ff59' : 'red';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.begGame { opacity: 0.8 !important; width: ' + endWidth + 'px !important; height: ' + endHeight + 'px !important; left:' + left + 'px !important; bottom:' + bottom + 'px !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);

    this._brickGameScoreCanvas.nativeElement.classList.add('begGame');

    let count = 5;

    let countDown = setInterval(() => {
      this._brickGameScoreCanvas.nativeElement.innerHTML = 'GAME START IN : <br>\ ' + count;
      count--
    }, 1000);

    setTimeout(() => {
      this._brickGameScoreCanvas.nativeElement.classList.remove('begGame');
      clearInterval(countDown);
      this.animate();
    }, 5500);

  }



  endGame() {

    let endHeight = this._brickGameScoreCanvas.nativeElement.offsetHeight * 2.3
    let endWidth = this._brickGameScoreCanvas.nativeElement.offsetWidth * 2.6

    let bottom = this._canvasContext.canvas.height / 2 - endHeight / 2
    let left = this._canvasContext.canvas.width / 2 - endWidth / 2

    this._canvasContext.fillStyle = '#212121'
    this._canvasContext.fillRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

    let backColor = (this.score > 0) ? '#b2ff59' : 'red';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.endGame { brackground-color: ' + backColor + ' !important; opacity: 0.8 !important; width: ' + endWidth + 'px !important; height: ' + endHeight + 'px !important; left:' + left + 'px !important; bottom:' + bottom + 'px !important; }';
    document.getElementsByTagName('head')[0].appendChild(style);

    this._brickGameScoreCanvas.nativeElement.classList.add('endGame');

    this._brickGameScoreCanvas.nativeElement.innerHTML = 'WELL DONE BABY, YOU GOT : <br>\ ' + this._brickGameScoreCanvas.nativeElement.innerHTML;

  }

  @HostListener('window:keydown', ['$event']) moveRacket(event: KeyboardEvent) {

    this.clearRacket(this.racketX);

    if (event.keyCode == 37 && this.racketX > 0) {
      this.racketX -= this.racketSpeed;
    }

    if (event.keyCode == 39 && this.racketX < this.canvasWidth) {
      this.racketX += this.racketSpeed;
    }
  }

  refreshScore() {
    this._brickGameScoreCanvas.nativeElement.innerHTML = this.score + ' PTS';
  }


  initPositions() {

    this.canvasWidth = this._canvasContext.canvas.width.valueOf();
    this.canvasHeight = this._canvasContext.canvas.height.valueOf();

    this.racketX = Math.round(this.canvasWidth / 2);
    this.racketY = Math.round(this.canvasHeight - 20);
  }

  generateBrickArray() {

    for (let index = 0; index < this.brickLines; index++) {

      let hitBorder = false;
      let consumedWidth = 0;

      while (!hitBorder) {

        let randomWidth = Math.round((Math.random() * this.canvasWidth * 0.1) + this.brickMinWidth);
        consumedWidth += randomWidth;

        //fit to canvas width size
        if (consumedWidth >= this.canvasWidth) {
          let gap = (consumedWidth - this.canvasWidth);
          randomWidth -= gap;
          consumedWidth -= gap;
          hitBorder = true;
        }

        this.bricks.push(new Brick(consumedWidth - randomWidth, this.brickHeight * index, randomWidth, this.brickHeight, ''));
      }
    }

  }

  drawBricksNSetColor() {
    for (let index = 0; index < this.bricks.length; index++) {
      this.drawBrick(this.bricks[index]);
    }
  }

  clearBrick(brick: Brick) {
    this._canvasContext.clearRect(brick.x, brick.y, brick.width, brick.height);
  }

  drawBrick(brick: Brick) {
    let color = this.color[Math.floor(Math.random() * this.color.length)];
    this._canvasContext.fillStyle = color;
    this._canvasContext.lineWidth = 2;
    this._canvasContext.strokeStyle = '#e0e0e0';
    this._canvasContext.fillRect(brick.x, brick.y, brick.width, brick.height);
    this._canvasContext.strokeRect(brick.x, brick.y, brick.width, brick.height);
    brick.color = color;
  }

  clearRacket(x: number) {
    this._canvasContext.clearRect(x - (this.racketSize / 2) - 5, this.racketY - 40, this.racketSize + 15, 80);
  }

  drawRacket(x: number) {

    this._canvasContext.beginPath();
    //this._canvasContext.filter = 'blur(1px)';
    this._canvasContext.arc(x, this.racketY + 222, this.racketSize, Math.PI * 1.35, Math.PI * 1.65);
    this._canvasContext.lineWidth = 2;
    this._canvasContext.strokeStyle = 'gray';
    this._canvasContext.stroke();


    this._canvasContext.fillStyle = '#e53935';
    this._canvasContext.fillRect(x - (this.racketSize / 2), this.racketY, this.racketSize, 15);
    this._canvasContext.strokeStyle = 'gray';
    this._canvasContext.strokeRect(x - (this.racketSize / 2), this.racketY, this.racketSize, 15);
  }


  clearBall(ball: Ball) {
    this._canvasContext.beginPath();
    this._canvasContext.clearRect(this.ball.x - this.ball.radius - 1, this.ball.y - this.ball.radius - 1, this.ball.radius * 2 + 2, this.ball.radius * 2 + 2);
    this._canvasContext.closePath();
  }

  drawBall(ball: Ball) {

    this._canvasContext.beginPath();
    this._canvasContext.fillStyle = ball.color;
    this._canvasContext.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    this._canvasContext.fill();
    this._canvasContext.closePath();

  }

  initContextShadows() {
    //shadow
    this._canvasContext.shadowBlur = 4;
    this._canvasContext.shadowOffsetX = 4;
    this._canvasContext.shadowOffsetY = 4;
    this._canvasContext.shadowColor = "#9e9e9e";
  }

}

class Brick {

  x: number;
  y: number;
  width: number;
  height: number;
  color: string;

  constructor(x: number, y: number, width: number, height: number, color: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

}

class Ball {

  x: number;
  y: number;
  xDirection: number;
  yDirection: number;
  radius: number;
  ballSpeed: number;
  color: string;

  constructor(x: number, y: number, xDirection: number, yDirection: number, radius: number, ballSpeed: number, color: string) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.ballSpeed = ballSpeed;
    this.color = color;
  }

}

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


      //display bricks on canvas;


/*       this._canvasContext.beginPath();
      this._canvasContext.lineCap = 'round';
      this._canvasContext.lineWidth = 15;
      this._canvasContext.strokeStyle = '#e53935';
      this._canvasContext.moveTo(racketX-(this.racketSize/2), racketY);
      this._canvasContext.lineTo(racketX+(this.racketSize/2), racketY);
      this._canvasContext.stroke();
      this._canvasContext.closePath(); */


