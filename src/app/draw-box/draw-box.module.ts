import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawBoxRoutingModule } from './draw-box-routing.module';
import { DrawBoxComponent } from './draw-box.component';


@NgModule({
  declarations: [
    DrawBoxComponent
  ],
  imports: [
    CommonModule,
    DrawBoxRoutingModule
  ]
})
export class DrawBoxModule { }
