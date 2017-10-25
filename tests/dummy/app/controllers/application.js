import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  firebaseApp: service(),

  actions: {
    login() {
      this.get('session').authenticate('authenticator:firebase', {
        'email': this.get('email'),
        'password': this.get('password')
      }).then(() => {
        this.transitionToRoute('index');
      });
    },
    register() {
      this.get('firebaseApp').auth().createUserWithEmailAndPassword(
        this.get('registerEmail'), this.get('registerPassword')
      ).then(() => {
        this.transitionToRoute('index');
      });
    },
    logout() {
      this.get('session').invalidate().then(() => {
        this.transitionToRoute('login');
      });
    }
  }
});
