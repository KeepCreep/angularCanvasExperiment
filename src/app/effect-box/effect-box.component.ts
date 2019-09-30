import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-effect-box',
  templateUrl: './effect-box.component.html',
  styleUrls: ['./effect-box.component.scss']
})
export class EffectBoxComponent implements OnInit {



  constructor() { }

  ngOnInit() {
    //this.generateSnowEffect();
  }

  generateSnowEffect() {

    const windowWidth = window.innerWidth.valueOf();
    const windowHeight = window.innerHeight.valueOf();

    const flakeSize = 20;
    const flakeDensity = 0.5;
    const flakeSwing = 50;
    const speed = 2;
    const pointerSize = 50;
    const pointerPush = 3;

    var canvas = document.createElement('canvas');
    canvas.width = flakeSize;
    canvas.height = flakeSize;

    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(flakeSize / 2, flakeSize / 2, flakeSize / 2, 0, Math.PI * 2, true);
    ctx.fillStyle = 'white';
    ctx.fill();

    const imgUrl = canvas.toDataURL().valueOf();

    var generateFlake = function (): { x: number, y: number, swing: number, swingVal: number, pushed: number, imgElement: HTMLImageElement } {

      let x = Math.round(Math.random() * windowWidth);
      let y = Math.round(Math.random() * windowHeight);
      let swing = Math.random() * 0.01;
      let swingVal = 1;

      let imgElement = document.createElement('img');
      imgElement.style.position = 'absolute';
      let rSize = Math.random();
      imgElement.style.width = rSize * flakeSize + "px";
      imgElement.style.height = rSize * flakeSize + "px";
      imgElement.style.top = '' + y + 'px';
      imgElement.style.left = '' + x + 'px';
      //imgElement.style.transition = "top left 1s ease-in-out 0s";
      imgElement.style.opacity = Math.random().toString();
      imgElement.src = imgUrl;

      return { x, y, swing, swingVal, pushed: 0, imgElement };

    }

    var flakes: { x: number, y: number, swing: number, swingVal: number, pushed: number, imgElement: HTMLImageElement }[] = [];

    for (let index = 0; index < flakeDensity * 1000; index++) {
      flakes[index] = generateFlake();
      document.body.appendChild(flakes[index].imgElement);
    }

    var seePush = function (flake: { x: number, y: number, swing: number, swingVal: number, pushed: number, imgElement: HTMLImageElement }) {

      if (flake.pushed != 0) {

        let pushIt = true;

        if ((flake.pushed > 0 && flake.pushed < pointerPush) || (flake.pushed < 0 && flake.pushed > -pointerPush)) {
          flake.pushed = 0;
          pushIt = false;
        }

        if (pushIt) {

          if (flake.pushed < 0) {
            flake.x -= pointerPush;
            flake.pushed += pointerPush;
          } else {
            flake.x += pointerPush;
            flake.pushed -= pointerPush;
          }

          flake.y -= pointerPush;
        }
      }

    }

    var anim = function () {
      for (let index = 0; index < flakes.length; index++) {
        if (flakes[index]) {

          seePush(flakes[index]);

          flakes[index].swingVal += flakes[index].swing;
          flakes[index].y = (flakes[index].y < windowHeight) ? flakes[index].y + speed : 1;
          flakes[index].imgElement.style.top = '' + flakes[index].y + 'px';

          let x = flakes[index].x + (flakeSwing * Math.cos(flakes[index].swingVal));
          flakes[index].imgElement.style.left = x + 'px';

        }
      }
      requestAnimationFrame(anim);
    }

    anim();

    var snowPush = function (e: any) {

      for (let index = 0; index < flakes.length; index++) {

        if (flakes[index] && e.clientX - pointerSize <= flakes[index].x
          && e.clientX + pointerSize >= flakes[index].x
          && e.clientY - pointerSize <= flakes[index].y
          && e.clientY + pointerSize >= flakes[index].y) {

          //curseur à gauche du flocon
          if (e.clientX < flakes[index].x) {
            flakes[index].pushed = -pointerSize*5*Math.random();
          } else {
            //curseur à droite du flocon
            flakes[index].pushed = pointerSize*5*Math.random();
          }
        }
      }

    };
  }

}
