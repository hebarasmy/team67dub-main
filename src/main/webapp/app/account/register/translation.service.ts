import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations: any = {
    'register.title': 'Registration',
    'global.form.username.placeholder': 'Enter Username',
    'global.form.email.placeholder': 'Enter Email',
    'global.form.newpassword.placeholder': 'Enter New Password',
    'global.form.confirmpassword.placeholder': 'Confirm Password',
    'register.form.button': 'Register',
    'register.messages.success': 'Registration saved! Please check your email for confirmation.',
    'register.messages.error.fail': 'Registration failed! Please try again later.',
    'register.messages.error.userexists': 'Login name already registered! Please choose another one.',
    'register.messages.error.emailexists': 'Email is already in use! Please choose another one.',
    'global.messages.error.dontmatch': 'The password and its confirmation do not match!',
    'global.messages.info.authenticated.link': 'sign in here',
  };

  translate(key: string): string {
    return this.translations[key] || key;
  }
}
