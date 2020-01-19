import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

const URL = "URL";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService){ }

  storeAll(){
    const recipes = this.recipeService.getRecipes();
    this.http.put(URL, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchAll(){
    return this.http.get<Recipe[]>(URL)
    .pipe(
      map(data => {
        return data.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      }
    ));
  }
}