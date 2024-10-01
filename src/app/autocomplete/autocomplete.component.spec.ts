import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.sourceItems = [ "Adam", "Betty", "Carl", "Charlie", "David", "Will", "William" ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items', fakeAsync(() => {
    component.searchString = "Wil";
    tick(2000);
    expect(component.filteredItems.length).toBe(2);
  }));

});
