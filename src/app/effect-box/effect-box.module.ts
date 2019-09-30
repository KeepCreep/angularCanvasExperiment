import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectBoxRoutingModule } from './effect-box-routing.module';
import { EffectBoxComponent } from './effect-box.component';


@NgModule({
  declarations: [EffectBoxComponent],
  imports: [
    CommonModule,
    EffectBoxRoutingModule
  ]
})
export class EffectBoxModule { }
