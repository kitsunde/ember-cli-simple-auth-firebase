import Base from 'ember-simple-auth/authenticators/base';
import Firebase from 'firebase';
import config from '../config/environment';

const { Promise } = Ember.RSVP;

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
    restore: function(data) {

        var _this = this;

        return new Promise(function(resolve, reject) {

            if (data.token) {

                _this.get('firebase').authWithCustomToken(data.token, function(error, success) {
                    Ember.run(function() {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(success);
                        }
                    });
                });

            } else {
                reject(new Error('Unable to restore Firebase session: no token found.'));
            }

        });

    },

    persist(data) {
        this._lastData = data;

        return RSVP.resolve();
    },

    authenticate: function(options) {
      var _this = this;
      if(options.provider === "password" || !options.provider){
        return _this.get('firebase').auth().signInWithEmailAndPassword(options.email, options.password).then(function(user) {
            return user.toJSON();
        });
      } else {
        return new Promise(function(resolve, reject) {
          var callback = function(error, authData) {
            Ember.run(function() {
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
    invalidate: function(data) {

        var _this = this;

        return new Promise(function(resolve, reject) {
            _this.get('firebase').unauth();
            resolve(data);
        });
    }
});
