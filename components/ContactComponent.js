import React, { Component } from 'react';
import { Text, Icon, Button } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';
import { getDatabase, ref, child, onValue } from 'firebase/database';
class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: '',
            street: '',
            district: '',
            city: '',
            phone: '',
            fax: '',
            email: ''
        }
    }
    render() {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card>
                    <Card.Title >Contact Information</Card.Title>
                    <Card.Divider></Card.Divider>
                    <Text style={{ margin: 10 }}>{this.state.number}, {this.state.street}</Text>
                    <Text style={{ margin: 10 }}>{this.state.district}</Text>
                    <Text style={{ margin: 10 }}>{this.state.city}</Text>
                    <Text style={{ margin: 10 }}>Tel: {this.state.phone}</Text>
                    <Text style={{ margin: 10 }}>Fax: {this.state.fax}</Text>
                    <Text style={{ margin: 10 }}>Email: {this.state.email}</Text>
                    <Button title=' Send Email' buttonStyle={{ backgroundColor: '#7cc' }}
                        icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                        onPress={this.sendMail} />
                </Card>
            </Animatable.View>

        );
    }
    sendMail() {
        MailComposer.composeAsync({
            recipients: ['<email_address>'],
            subject: 'From Confusion',
            body: 'Hello my friends ...'
        });
    }
    componentDidMount() {
        const dbRef = ref(getDatabase());
        onValue(child(dbRef, 'contact/'), (snapshot) => {
            const value = snapshot.val();
            this.setState({
                number: value.address.number,
                street: value.address.street,
                district: value.address.district,
                city: value.address.city,
                phone: value.phone,
                fax: value.fax,
                email: value.email
            });
        });
    }
}

export default Contact;