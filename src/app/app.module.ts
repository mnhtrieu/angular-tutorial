import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from '@ngrx/effects';
import * as fromApp from './store/app.reducer'
import { AuthEffects } from './auth/store/auth.effects';

@NgModule({
  declarations: [ AppComponent, HeaderComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoreModule,
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forRoot( fromApp.appReducer
      // {
      // shoppingList: shoppingListReducer, // keyname: reducer
      // auth: authReducer}
      )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
