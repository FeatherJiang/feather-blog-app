import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';
import { Icon, Button, Text, Card, CardItem, Left, Thumbnail, Body } from 'native-base';
import avatar from '../../assets/img/feather.jpg';
import config from '../../config';

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: '100%',
    flex: 1,
  },
});

function ArticleOverview(props) {
  return (
    <Card>
      <CardItem button onPress={() => { props.navigation.navigate('article', { aid: props.data.aid }); }}>
        <Left>
          <Thumbnail small source={avatar} />
          <Body>
            <Text>{props.data.title}</Text>
            <Text note>{new Date(props.data.createdAt).toLocaleString()}</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem button cardBody onPress={() => { props.navigation.navigate('article', { aid: props.data.aid }); }}>
        <Body>
          <Image source={{ uri: config.baseURL + props.data.banner }} style={styles.img} />
        </Body>
      </CardItem>
      <CardItem>
        <Body>
          <Text>{props.data.overview}</Text>
        </Body>
      </CardItem>
      <CardItem>
        <Button transparent iconLeft>
          <Icon active name="star" />
          <Text>{props.data.starNum}</Text>
        </Button>
        <Button transparent iconLeft>
          <Icon active name="eye" />
          <Text>{props.data.watchNum}</Text>
        </Button>
        <Button transparent iconLeft>
          <Icon active name="chatbubbles" />
          <Text>{props.data.commentsNum}</Text>
        </Button>
      </CardItem>
    </Card>
  );
}

ArticleOverview.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ArticleOverview;
