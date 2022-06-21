import React, { Component } from 'react';
import { ScrollView, View, Button, Image } from 'react-native';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../shared/baseUrl';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: baseUrl + 'images/logo.png',
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
        }
    }
    render() {
        return (
            <ScrollView>
                <View style={{ justifyContent: 'center', margin: 20 }}>
                    <View style={{ flex: 1, flexDirection: 'row', margin: 20 }}>
                        <Image style={{ margin: 10, width: 80, height: 60 }} source={{ uri: this.state.imageUrl }} />
                        <View style={{ justifyContent: 'center' }}>
                            <Button title='Camera' onPress={() => this.getImageFromCamera()} />
                        </View>
                    </View>
                    <Input placeholder='Username' leftIcon={{ type: 'font-awesome', name: 'user-o' }} value={this.state.username}
                        onChangeText={(username) => this.setState({ username })} />
                    <Input placeholder='Password' leftIcon={{ type: 'font-awesome', name: 'key' }} value={this.state.password}
                        onChangeText={(password) => this.setState({ password })} />
                    <Input
                        placeholder='First Name'
                        leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                        value={this.state.firstname}
                        onChangeText={(firstname) => this.setState({ firstname })} />
                    <Input
                        placeholder='Last Name'
                        leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                        value={this.state.lastname}
                        onChangeText={(lastname) => this.setState({ lastname })} />
                    <Input
                        placeholder='Email'
                        leftIcon={{ name: 'user-o', type: 'font-awesome' }}
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })} />
                    <View style={{ marginTop: 20 }}>
                        <Button title='Register' color='#7cc' onPress={() => this.handleRegister()} />
                    </View>
                </View>
            </ScrollView>
        );
    }
    async getImageFromCamera() {
        let capturedImage = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3] });
        if (!capturedImage.cancelled) {
            this.setState({ imageUrl: capturedImage.uri });
        }
    }
    handleRegister() {
        alert('Coming soon!');
    }
}
export default Register;