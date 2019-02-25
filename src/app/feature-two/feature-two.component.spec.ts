import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureTwoComponent } from './feature-two.component';

describe('FeatureTwoComponent', () => {
  let component: FeatureTwoComponent;
  let fixture: ComponentFixture<FeatureTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
