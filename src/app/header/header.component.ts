import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  private subscription: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>){ }

  onSaveData(){
    this.dataStorageService.storeAll();
  }

  onFetchData(){
    this.dataStorageService.fetchAll().subscribe();
  }

  onLogout(){
    this.authService.logout();
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