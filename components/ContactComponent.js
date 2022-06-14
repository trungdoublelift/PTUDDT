import React, {Component} from 'react';
import { Text } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class Contact extends Component{
    render(){
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card>
                <Card.Title >Contact Information</Card.Title>
                <Card.Divider></Card.Divider>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>121, Clear Water Bay Road</Text>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>Clear Water Bay, Kowloon</Text>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>HONG KONG</Text>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>Tel: +852 1234 5678</Text>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>Fax: +852 8765 4321</Text>
                <Text style={{ margin: 10, fontWeight: 'bold' }}>Email:confusion@food.net</Text>
            </Card>
            </Animatable.View>
            
        );
    }
}

export default Contact;