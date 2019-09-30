import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrickBoxComponent } from './brick-box.component';

describe('BrickBoxComponent', () => {
  let component: BrickBoxComponent;
  let fixture: ComponentFixture<BrickBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrickBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrickBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
