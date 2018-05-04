import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image } from 'react-native';
import {
  Container,
  Content,
  Header,
  Title,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Text,
  Button,
  Icon,
  Toast,
  Spinner,
  Footer,
  FooterTab,
} from 'native-base';
import Markdown from 'react-native-simple-markdown';

import config from '../../config';
import { GETED, CREATED, DELETED } from '../../config/statusCode';
import API from '../../API';
import avatar from '../../assets/img/feather.jpg';

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: '100%',
    flex: 1,
  },
  icon: {
    color: '#327cf7',
  },
});

class Article extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      like: false,
      aid: 1,
      title: '',
      banner: '',
      createdAt: '',
      content: '',
      starNum: 0,
      watchNum: 0,
      commentsNum: 0,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getArticle(this.props.navigation.state.params.aid);
      },
    );
  }

  async getArticle(parameter) {
    this.setState({
      loading: true,
    });
    try {
      const result = await API.getArticle({ parameter });
      if (result.statusCode === GETED) {
        this.setState({
          aid: result.data.aid,
          title: result.data.title,
          banner: result.data.banner,
          createdAt: result.data.createdAt,
          content: result.data.content,
          starNum: result.data.starNum,
          watchNum: result.data.watchNum,
          commentsNum: result.data.commentsNum,
        });
      }
      this.setState({
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      Toast.show({
        text: error.error,
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  handleClick() {
    if (this.state.like) {
      this.unstar();
    } else {
      this.star();
    }
  }

  async star() {
    try {
      const result = await API.putStar({ parameter: this.state.aid });
      if (result.statusCode === CREATED) {
        this.setState(preState => ({
          like: true,
          starNum: preState.starNum + 1,
        }));
        Toast.show({
          text: 'star success',
          position: 'bottom',
          duration: 2000,
        });
      }
    } catch (error) {
      Toast.show({
        text: error.error,
        position: 'bottom',
        duration: 2000,
      });
    }
  }

  async unstar() {
    try {
      const result = await API.delStar({ parameter: this.state.aid });
      if (result.statusCode === DELETED) {
        this.setState(preState => ({
          like: false,
          starNum: preState.starNum - 1,
        }));
        Toast.show({
          text: 'unstar success',
          position: 'bottom',
          duration: 3000,
        });
      }
    } catch (error) {
      Toast.show({
        text: error.error,
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.goBack();
              }}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.title}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.loading ? <Spinner color="blue" /> : null}
          <Card>
            <CardItem>
              <Left>
                <Thumbnail small source={avatar} />
                <Body>
                  <Text>{this.state.title}</Text>
                  <Text note>{new Date(this.state.createdAt).toLocaleString()}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Body>
                <Image source={{ uri: config.baseURL + this.state.banner }} style={styles.img} />
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                <Markdown>{this.state.content}</Markdown>
              </Body>
            </CardItem>
            <CardItem>
              <Button transparent iconLeft>
                <Icon active name="star" />
                <Text>{this.state.starNum}</Text>
              </Button>
              <Button transparent iconLeft>
                <Icon active name="eye" />
                <Text>{this.state.watchNum}</Text>
              </Button>
              <Button transparent iconLeft>
                <Icon active name="chatbubbles" />
                <Text>{this.state.commentsNum}</Text>
              </Button>
            </CardItem>
          </Card>
        </Content>
        <Footer>
          <FooterTab>
            <Button onPress={this.handleClick}>
              <Icon name="star" active={this.state.like} style={styles.icon} />
              <Text style={styles.icon}>Star</Text>
            </Button>
            <Button
              onPress={() => {
                this.props.navigation.navigate('comments', {
                  aid: this.state.aid,
                  pid: 0,
                  limit: 10,
                });
              }}
            >
              <Icon name="chatboxes" style={styles.icon} />
              <Text style={styles.icon}>Comments</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

Article.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Article;
