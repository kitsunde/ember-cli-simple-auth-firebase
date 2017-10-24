import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import { get } from '@ember/object';
import Base from 'ember-simple-auth/authenticators/base';
import {inject as service} from '@ember/service';

export default Base.extend({
  firebase: service('firebase-app'),

  restore(data) {
    const token = get(data, 'stsTokenManager.accessToken');
    const firebase = this.get('firebase');

    if (token) {
      return new Promise(function(resolve, reject) {
        return firebase.auth().onAuthStateChanged(run.bind(this, function(user) {
          if (!user) {
            return reject(
              new Error('User not logged in.')
            );
          }

          return resolve(user);
        }));
      });

    } else {
      return Promise.reject(
        new Error('Unable to restore Firebase session: no token found.')
      );
    }
  },

  authenticate(options) {
    const auth = this.get('firebase').auth();
    if (options.provider === "password" || !options.provider) {
      return auth.signInWithEmailAndPassword(options.email, options.password);
    } else {
      if (options.redirect) {
        auth.signInWithRedirect(options.provider);
        return auth.getRedirectResult();
      } else {
        return auth.signInWithPopup(options.provider);
      }
    }
  },

  invalidate: function() {
    return this.get('firebase').auth().signOut();
  }
});
