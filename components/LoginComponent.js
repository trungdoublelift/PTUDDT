import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { Input, CheckBox } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { getDatabase, ref, child, get } from 'firebase/database';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
 
      remember: false
    }
  }
  handleLogin() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, 'accounts/' + this.state.username)).then((snapshot) => {
      if (snapshot.exists()) {
        const account = snapshot.val();
        if (account.password === this.state.password) {
          alert('Come on baby!');
          if (this.state.remember) {
            SecureStore
              .setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
              .catch((error) => alert('Could not save user info',error));
          }
        } else {
          alert('Invalid password!');
          SecureStore
            .deleteItemAsync('userinfo')
            .catch((error) => alert('Could not delete user info',error));
        }
      } else {
        alert('Invalid username!');
        SecureStore
          .deleteItemAsync('userinfo')
          .catch((error) => alert('Could not delete user info',error));
      }
    }).catch((error) => alert('Could not get data from firebase',error));
  }
  render() {
    return (
      <View style={{ justifyContent: 'center', margin: 20 }}>
        <Input
          placeholder='Username'
          leftIcon={{ name: 'user-o', type: 'font-awesome' }}
          value={this.state.username}
          onChangeText={(username) => this.setState({ username })} />
        <Input
          placeholder='Password'
          leftIcon={{ name: 'key', type: 'font-awesome' }}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })} />
        
        <CheckBox containerStyle={{ backgroundColor: null }}
          title='Remember Me' center
          checked={this.state.remember}
          onPress={() => this.setState({ remember: !this.state.remember })} />
        <View style={{ marginTop: 20 }}>
          <Button title='Login' color='#7cc' onPress={() => this.handleLogin()} />
        </View>
      </View>
    );
  }
  componentDidMount() {
    SecureStore.getItemAsync('userinfo')
      .then((userdata) => {
        let userinfo = JSON.parse(userdata);
        if (userinfo) {
          this.setState({ username: userinfo.username });
          this.setState({ password: userinfo.password });
          this.setState({ remember: true })
        }
      });
  }
  // handleLogin() {
  //   if (this.state.remember) {
  //     SecureStore
  //       .setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
  //       .catch((error) => alert('Could not save user info', error));
  //     alert('Remembered user!');
  //   } else {
  //     SecureStore
  //       .deleteItemAsync('userinfo')
  //       .catch((error) => alert('Could not delete user info', error));
  //     alert('Forgotten user!');
  //   }
  // }
}
export default Login;