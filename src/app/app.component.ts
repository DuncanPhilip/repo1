import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutocompleteComponent } from "./autocomplete/autocomplete.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ AutocompleteComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy
{
  public worldCities:string[] = [];

  public selectionMessage:string = "";
  private sub:Subscription;

  public constructor(private http:HttpClient)
  {

  }

  public ngOnInit(): void 
  {
    this.sub = this.http.get("assets/world-cities.txt", { responseType: 'text' }).pipe(
      catchError((error, caught) => 
        { 
          console.log(error); 
          return caught; 
        }
        )).subscribe( result =>
      {
        // break the text into a list of cities
        let cities = result.split('\r\n');
        // remove the "name" header from the top
        cities.shift();

        // remove the duplicates 
        const uniqueCities:Set<string> = new Set(cities);
        cities = [...uniqueCities];

        // sort the final result
        cities.sort();

        this.worldCities = cities;

      }
    );
  }

  public onItemSelected(item:string)
  {
    this.selectionMessage = "You selected: " + item;
  }

  public ngOnDestroy(): void 
  {
    if (this.sub)
    {
      this.sub.unsubscribe();
    }
  }
}
