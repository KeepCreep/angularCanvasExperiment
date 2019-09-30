import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrickBoxRoutingModule } from './brick-box-routing.module';
import { BrickBoxComponent } from './brick-box.component';


@NgModule({
  declarations: [BrickBoxComponent],
  imports: [
    CommonModule,
    BrickBoxRoutingModule
  ]
})
export class BrickBoxModule { }
