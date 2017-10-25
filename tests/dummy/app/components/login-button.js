import Component from '@ember/component';
import { inject as service } from '@ember/service';
import firebase from 'firebase';

export default Component.extend({
  session: service(),

  tagName: 'button',
  click() {
    const provider = new firebase.auth.GoogleAuthProvider();

    this.get('session').authenticate('authenticator:firebase', {
      provider,
    });
  }
});
