import { NgModule } from '@angular/core';
// import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  providers: [
    // ShoppingListService, 
    RecipeService, 
    HttpClientModule, 
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ]
})
export class CoreModule { }