import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import Base from 'ember-simple-auth/authenticators/base';
import { inject as service } from '@ember/service';

export default Base.extend({
  firebaseApp: service(),

  restore(data) {
    const firebase = this.get('firebaseApp');

    if (data) {
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
    const auth = this.get('firebaseApp').auth();
    if (options.provider === "password" || !options.provider) {
      return auth.signInWithEmailAndPassword(options.email, options.password).then(user => user.uid);
    } else {
      if (options.redirect) {
        auth.signInWithRedirect(options.provider);
        return auth.getRedirectResult();
      } else {
        return auth.signInWithPopup(options.provider).then(provider => provider.user.uid);
      }
    }
  },

  invalidate: function() {
    return this.get('firebaseApp').auth().signOut();
  }
});
