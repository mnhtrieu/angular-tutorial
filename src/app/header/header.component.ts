import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  private subscription: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService){ }

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
    this.subscription = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}