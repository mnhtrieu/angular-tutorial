import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
import * as fromShoppingList from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ingredients: Ingredient[]}>;
  private subscription: Subscription;

  constructor(/*private slService: ShoppingListService,*/ private loggingService: LoggingService, 
    private store: Store<fromShoppingList.AppState> // shoppingList => key defined in app.module.ts and the value is the object of the state
    // private store: Store<{shoppingList: {ingredients: Ingredient[]}}>
    ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => { this.ingredients = ingredients; });
    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }


  ngOnDestroy(){
    // this.subscription.unsubscribe();
  }

  onEditItem(idx: number){
    this.store.dispatch(new ShoppingListActions.StartEdit(idx));
  }


}
