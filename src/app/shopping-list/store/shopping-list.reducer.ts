import { Ingredient } from '../../shared/ingredient.model';
import { Action } from '@ngrx/store';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIdx: number;
}

export interface AppState {
  shoppingList: State;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: null,
  editedIngredientIdx: -1
};
// STATE changes with NGRX must be IMMUTABLE!!!
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch(action.type){
    //------------------------------------------
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    //------------------------------------------
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    //------------------------------------------
    case ShoppingListActions.UPDATE_INGREDIENT: 
      const ingredient = state.ingredients[state.editedIngredientIdx];
      const updated = {
        ...ingredient, 
        ...action.payload};
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIdx] = updated;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIdx: -1
      };
    //------------------------------------------
    case ShoppingListActions.DELETE_INGREDIENT: 
      return {
        ...state,
        ingredients: state.ingredients.filter((ig,idx) => idx !== state.editedIngredientIdx),
        editedIngredient: null,
        editedIngredientIdx: -1
      };
    //------------------------------------------
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIdx: action.payload,
        editedIngredient: { ...state.ingredients[action.payload]}
      };
    //------------------------------------------
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIdx: -1
      };
    //------------------------------------------
    default:
      return state;
  }
}