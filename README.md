#Firebase Authenticator for Ember Simple Auth
This is a custom authenticator for the fantastic [Ember Simple Auth](https://github.com/simplabs/ember-simple-auth) project.

## Installation

```bash
ember install ember-cli-simple-auth-firebase
```

## Usage

After [configuring Ember Simple Auth](https://github.com/simplabs/ember-simple-auth#the-session), you'll need to make sure your Firebase is configured in `config/environment.js` like so:

`firebase: 'https://<firebase-name>.firebaseio.com/'`

To use it, you can do something like this in one of your controllers:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({

    actions: {
        login: function() {
            this.get('session').authenticate('authenticator:firebase', {
                'email': this.get('email'),
                'password': this.get('password')
            }).then(function() {
                this.transitionToRoute('index');
            }.bind(this));
        },
        logout: function() {
            this.get('session').invalidate().then(function() {
                this.transitionToRoute('login');
            }.bind(this));
        }
    }
});
```

## Credits

Thanks to [Simplabs](https://github.com/simplabs) for create Ember Simple Auth in the first place!

## License

Released under the MIT License.
