import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, Subscription, switchMap, Observable, of } from 'rxjs';

@Component({
  selector: 'autocomplete',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent implements OnInit, OnDestroy
{
  @Input() sourceItems:string[] = [];

  @Output() itemSelected:EventEmitter<string> = new EventEmitter();

  public filteredItems:string[] = [];

  private _searchString:string = "";

  private subscription:Subscription;
  private inputSubject:Subject<string> = new Subject();

  private MIN_SEARCH_LENGTH:number = 2;

  public constructor() 
  {

  }

  public ngOnInit(): void 
  {
    // Subscribe to the input changed subject
    this.subscription = this.inputSubject.pipe(
      debounceTime(500),
      switchMap(x => this.getFilteredItems(x)),
    ).subscribe(x => {
      this.filteredItems = x;
    }
    );
  }

  private getFilteredItems(search:string) : Observable<string[]>
  {
    let matchingItems:string[] = [];
    // we need a minimum num of characters before we can search, else the results can be too large and it can look ugly
    if (search.length >= this.MIN_SEARCH_LENGTH)
    {
      matchingItems = this.sourceItems.filter(item => { return item.toUpperCase().startsWith(search.toUpperCase()) } );
    }
    return of(matchingItems);
  }

  @Input() 
  public set searchString(value:string)
  {
    let changed:boolean = this._searchString != value;
    this._searchString = value;
    if (changed)
    {
      this.inputSubject.next(value);
    }
  }

  public get searchString() : string
  {
    return this._searchString;
  }

  public selectItem(item:string) : void
  {
    this._searchString = item;

    this.filteredItems = [];
    this.itemSelected.emit(item);
  }

  public onInputChanged(event:Event) : void
  {
    if (event instanceof InputEvent)
    {
      this.inputSubject.next(this.searchString);
    }
    else 
    {
    // if its just a regular event, and not an InputEvent, then most likely the user selected one of the datalist options, which dont support click events (!)
      this.selectItem(this.searchString);
    }
  }

  public trackByFunction(index:number, item:string) : string
  {
    return item;
  }

  public ngOnDestroy(): void 
  {
    // unsubscribe
    if (this.subscription)
    {
      this.subscription.unsubscribe();
    }
  }

}
