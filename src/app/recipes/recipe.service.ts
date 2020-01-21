import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(/*private slService: ShoppingListService, */private store: Store<fromApp.AppState>){ }

  getRecipes(){
    return this.recipes.slice(); // deep copy
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  getRecipe(idx: number){
    return this.recipes[idx];
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(idx: number, newRecipe: Recipe){
    this.recipes[idx] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(idx :number){
    this.recipes.splice(idx, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}