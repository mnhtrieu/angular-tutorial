import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
// import { DataStorageService } from '../shared/data-storage.service';
// import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../recipes/store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {

  // constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService){ }
  // importing actions$ for a trick to return an observable in the resolve
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.store.select('recipes').pipe(take(1), map(recipesState => {
      return recipesState.recipes;
    }),
    switchMap(recipes => {
      if(recipes.length === 0){
        this.store.dispatch(new RecipeActions.FetchRecipes());
        return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
      } else{
        return of(recipes);
      }
    })
    );
    // // What is happening here? We dispatch the action and wait for the SetRecipe. Then we know it was set.
    // this.store.dispatch(new RecipeActions.FetchRecipes());
    // return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
    // return this.dataStorageService.fetchAll();
    // const recipes = this.recipeService.getRecipes();
    // if(recipes.length === 0)
    //   return this.dataStorageService.fetchAll();
    // else return null;
  }
}