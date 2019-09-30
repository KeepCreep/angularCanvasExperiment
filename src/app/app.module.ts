import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavModule } from './sidenav/sidenav.module';
import { DrawBoxModule } from './draw-box/draw-box.module';
import { EffectBoxModule } from './effect-box/effect-box.module';
import { BrickBoxModule } from './brick-box/brick-box.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SidenavModule,
    DrawBoxModule,
    EffectBoxModule,
    BrickBoxModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
