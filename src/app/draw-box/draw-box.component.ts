import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-draw-box',
  templateUrl: './draw-box.component.html',
  styleUrls: ['./draw-box.component.scss']
})
export class DrawBoxComponent implements OnInit, AfterViewInit {

  @ViewChild('drawCanvas', { static: false })
  private _canvasElement: ElementRef;

  private _canvasContext: CanvasRenderingContext2D;
  private _lastX: number;
  private _lastY: number;


  private _pencilPressed: boolean = false;
  private _pencilSize: number = 1;
  private _pencilColor: string = "#ffffff";
  private _pencilShape: string = 'pencil';

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    this._canvasContext = this._canvasElement.nativeElement.getContext('2d');
    this._canvasContext.canvas.height = this._canvasElement.nativeElement.parentElement.offsetHeight;
    this._canvasContext.canvas.width = this._canvasElement.nativeElement.parentElement.offsetWidth;

    this._canvasContext.fillStyle = "gray"
    this._canvasContext.fillRect(0, 0, this._canvasContext.canvas.width, this._canvasContext.canvas.height);

  }

  executeDraw(event: any) {

    if (this._pencilPressed) {

      if (this._canvasContext && this._lastX && this._lastY) {

        this._canvasContext.beginPath();
        this._canvasContext.strokeStyle = this._pencilColor;
        this._canvasContext.lineCap = 'round';
        this._canvasContext.lineWidth = this._pencilSize;
        this._canvasContext.moveTo(this._lastX, this._lastY);
        this._canvasContext.lineTo(event.layerX, event.layerY);
        this._canvasContext.stroke();

      }

      this._lastX = event.layerX;
      this._lastY = event.layerY;
    }
  }

  activePencil() {
    this._pencilPressed = true;
  }

  inactvePencil() {
    this._pencilPressed = false;
    this._lastX = undefined;
    this._lastY = undefined;
  }

  get pencilColor(): string {
    return this._pencilColor;
  }


  get pencilSize(): number {
    return this._pencilSize;
  }

  chooseColor(event: any) {
    this._pencilColor = event.target.value;
    this.refreshCursorStyle();
  }

  chooseSize(event: any) {
    this._pencilSize = event.target.value;
    this.refreshCursorStyle();
  }

  refreshCursorStyle() {
    let canvas = document.createElement('canvas');
    canvas.width = this._pencilSize;
    canvas.height = this._pencilSize;

    let ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(this.pencilSize / 2, this.pencilSize / 2, this.pencilSize / 2, 0, Math.PI * 2, true);
    ctx.fillStyle = this._pencilColor;
    ctx.fill();

    this._canvasElement.nativeElement.style.cursor = "url(" + canvas.toDataURL() + "), auto";

  }



}






