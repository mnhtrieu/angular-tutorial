import { Component, OnInit, OnDestroy } from '@angular/core';
// import { DataStorageService } from '../shared/data-storage.service';
// import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  private subscription: Subscription;
  isAuthenticated = false;

  constructor(/*private dataStorageService: DataStorageService, private authService: AuthService, */private store: Store<fromApp.AppState>){ }

  onSaveData(){
    // this.dataStorageService.storeAll();
    this.store.dispatch(new RecipeActions.StoreRecipes());
  }

  onFetchData(){
    // this.dataStorageService.fetchAll().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout(){
    // this.authService.logout();
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnInit(){
    this.subscription = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}