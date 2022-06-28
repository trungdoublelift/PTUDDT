import { connect, } from 'react-redux';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';
import React, { Component } from 'react';
import { View, ScrollView, Text, FlatList, YellowBox, Modal, Button, PanResponder, Alert } from 'react-native';
import { Card, Image, Icon, Rating, Input } from 'react-native-elements';
import { baseUrl } from '../shared/baseUrl';
import { SliderBox } from 'react-native-image-slider-box';


const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  }
};
const mapDispatchToProps = dispatch => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});

class RenderSlider extends Component {
   images = [

    baseUrl + 'images/buffet.png',
    baseUrl + 'images/logo.png'
  ];
  render() {
    return (
      <Card onLayout={this.onLayout}>
        <SliderBox images={images} parentWidth={this.state.width - 30} />
      </Card>
    )
  }
  constructor(props) {
    super(props);
    this.state = {
      width: 30,
      height: 0
    };
  }
  // render() {

  //   return (

  //   );
  // }
  onLayout = (evt) => {
    this.setState({
      width: evt.nativeEvent.layout.width,
      height: evt.nativeEvent.layout.height,
    });
  };
}



class RenderDish extends Component {
  render() {
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return true; // right to left
      return false;
    };
    const recognizeComment = ({ dx }) => {
      if (dx > 200) return true; // Left to right
      return false;
    };
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => { return true; },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState)) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + dish.name + ' to favorite?',
            [
              { text: 'Cancel', onPress: () => { /* nothing */ } },
              { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
            ]
          );
        } else if (recognizeComment(gestureState)) {
          this.props.onPressComment();
        }
        return true;
      }
    });

    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card {...panResponder.panHandlers}>
          {/* <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image> */}
          <Card.Title>{dish.name}</Card.Title>
          <Card.Divider />
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Icon raised reverse name={this.props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
              onPress={() => this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite()} />
            <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8'
              onPress={() => this.props.onPressComment()} />
          </View>
        </Card>
      );
    }
    return (<View />);
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <FlatList data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={item => item.id.toString()} />
      </Card>
    );
  }

  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating startingValue={item.rating} imageSize={16} readonly style={{ flexDirection: 'row' }} />
        <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
      </View>
    );
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      rating: 3,
      author: '',
      comment: ''
    };
    YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']); // ref: https://forums.expo.io/t/warning-virtualizedlists-should-never-be-nested-inside-plain-scrollviews-with-the-same-orientation-use-another-virtualizedlist-backed-container-instead/31361/6
  }

  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    return (
      <ScrollView>
        <Animatable.View animation="flipInY" duration={2000} delay={1000}>
          <RenderSlider />
        </Animatable.View>
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
          <RenderDish dish={this.props.dishes.dishes[dishId]}
            favorite={this.props.favorites.some(el => el === dishId)}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.setState({ showModal: true })} />
        </Animatable.View>
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
          <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
        </Animatable.View>
        <Modal visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <View style={{ justifyContent: 'center', margin: 20 }}>
            <Rating startingValue={this.state.rating} showRating={true}
              onFinishRating={(value) => this.setState({ rating: value })} />
            <View style={{ height: 20 }} />
            <Input value={this.state.author} placeholder='Author' leftIcon={{ name: 'user-o', type: 'font-awesome' }}
              onChangeText={(text) => this.setState({ author: text })} />
            <Input value={this.state.comment} placeholder='Comment' leftIcon={{ name: 'comment-o', type: 'font-awesome' }}
              onChangeText={(text) => this.setState({ comment: text })} />
            <View style={{ flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
              <Button title='SUBMIT' color='#512DA8' onPress={() => { this.submitComment(dishId); this.setState({ showModal: false }); }} />
              <View style={{ height: 10 }} />
              <Button title='CANCEL' color='#808080'
                onPress={() => { this.setState({ showModal: false }); }} />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  submitComment(dishId) {
    //alert(dishId + ':' + this.state.rating + ':' + this.state.author + ':' + this.state.comment);
    this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);