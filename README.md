#Firebase Authenticator for Ember Simple Auth
This is a custom authenticator for the fantastic [Ember Simple Auth](https://github.com/simplabs/ember-simple-auth) project.

## Installation

```bash
ember install ember-cli-simple-auth-firebase
```

## Usage

Configure [Ember Simple Auth](https://github.com/simplabs/ember-simple-auth#the-session) and [Emberfire](https://github.com/firebase/emberfire#installation)

The default authenticator uses email/password based auth:

```javascript
export default Component.extend({
  click(){
    this.get('session').authenticate('authenticator:firebase', {
      'email': this.get('email'),
      'password': this.get('password')
    });
  }
});
```

Using different authenticators:

```javascript
import firebase from 'firebase';

export default Component.extend({
  click(){
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    
    this.get('session').authenticate('authenticator:firebase', {
      provider,
    });
  }
});
```

## Credits

Thanks to [Simplabs](https://github.com/simplabs) for create Ember Simple Auth in the first place!

## License

Released under the MIT License.
