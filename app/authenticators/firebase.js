import { run } from '@ember/runloop';
import { Promise } from 'rsvp';
import { get } from '@ember/object';
import Firebase from 'firebase';
import Base from 'ember-simple-auth/authenticators/base';
import config from '../config/environment';

export default Base.extend({

  init: function() {
    if (config.firebase) {
      this.set('firebase', Firebase.initializeApp(config.firebase));
    } else {
      throw new Error("'firebase' not defined in environment");
    }

    this._super();
  },

  firebase: null,

  restore(data) {
    const token = get(data, 'stsTokenManager.accessToken');
    const firebase = this.get('firebase');

    if (token) {
      return new Promise(function(resolve, reject) {
        return firebase.auth().onAuthStateChanged(function(user) {
          run(function() {
            if (!user) {
              return reject(
                new Error('User not loggined')
              );
            }

            return resolve(user);
          });
        });
      });

    } else {
      return Promise.reject(
        new Error('Unable to restore Firebase session: no token found.')
      );
    }
  },

  authenticate(options) {
    var _this = this;
    if(options.provider === "password" || !options.provider){
      return this.get('firebase')
        .auth()
        .signInWithEmailAndPassword(options.email, options.password)
        .then(function(user) {
          return user.toJSON();
        });
    } else {
      return new Promise(function(resolve, reject) {
        var callback = function(error, authData) {
        run(function() {
          if (error) {
          reject(error);
          } else {
          resolve(authData);
          }
        });
        };
        if(options.redirect){
        _this.get('firebase').authWithOAuthRedirect(options.provider, callback);
        } else {
        _this.get('firebase').authWithOAuthPopup(options.provider, callback)
        }
      });
    }
  },

  invalidate: function() {
    return _this.get('firebase').signOut();
  }
});
