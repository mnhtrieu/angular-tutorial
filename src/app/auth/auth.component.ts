import { Component, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective; 
  private subscription: Subscription;

  // MUST BE A RESOLVER (COMPONENT FACTORY -- DYNAMIC COMPONENTS)
  constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver){ }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if(this.isLoginMode) authObs = this.authService.login(email, password);
    else authObs = this.authService.signup(email, password);

    authObs.subscribe(data => {
      console.log(data);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, error => {
      console.log(error);
      // this.error = error;
      this.showErrorAlert(error);
      this.isLoading = false;
    });

    form.reset();
  }
  // passing for one reason: we dont need the "global this.error" anymore, if we choose this approach
  private showErrorAlert(message: string){
    // const alertCmp = new AlertComponent(); // THIS WONT WORK (no DI, nothing, its just plain Javascript object)
    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(factory);
    componentRef.instance.message = message;
    this.subscription = componentRef.instance.close.subscribe(() =>{ 
      this.subscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(){
    if(this.subscription) this.subscription.unsubscribe();
  }
}