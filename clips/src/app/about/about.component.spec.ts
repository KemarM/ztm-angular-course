import { TestBed, ComponentFixture } from "@angular/core/testing"
import { AboutComponent } from "./about.component";

describe('About Component', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent],
    }).compileComponents();
  });
  beforeEach(() => { // creates a new instance of the component to uniquely test it, avoiding shared tests which can pose issues with changing states
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  })
});
