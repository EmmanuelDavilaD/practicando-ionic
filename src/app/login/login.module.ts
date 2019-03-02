import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage]
})


login(): void {
  this.oauthService.createAndSaveNonce().then(nonce => {
    const authClient = new OktaAuth({
      clientId: this.oauthService.clientId,
      redirectUri: this.oauthService.redirectUri,
      url: this.oauthService.issuer
    });


    
    authClient.signIn({
      username: this.username,
      password: this.password
    }).then((response) => {
      if (response.status === 'SUCCESS') {
        authClient.token.getWithoutPrompt({
          nonce: nonce,
          responseType: ['id_token', 'token'],
          sessionToken: response.sessionToken,
          scopes: this.oauthService.scope.split(' ')
        })
          .then((tokens) => {
            // oauthService.processIdToken doesn't set an access token
            // set it manually so oauthService.authorizationHeader() works
            localStorage.setItem('access_token', tokens[1].accessToken);
            this.oauthService.processIdToken(tokens[0].idToken, tokens[1].accessToken);
            this.navCtrl.push(TabsPage);
          })
          .catch(error => console.error(error));
      } else {
        throw new Error('We cannot handle the ' + response.status + ' status');
      }
    }).fail((error) => {
      console.error(error);
      this.error = error.message;
    });
  });
}


export class LoginPageModule {}
