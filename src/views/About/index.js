import React from 'react';
import { StyleSheet, Image, RefreshControl } from 'react-native';
import {
  Container,
  Header,
  Content,
  Body,
  Title,
  Card,
  CardItem,
  Thumbnail,
  Left,
  Text,
  Spinner,
  Toast,
} from 'native-base';
import Markdown from 'react-native-markdown-renderer';
import avatar from '../../assets/img/feather.jpg';
import background from '../../assets/img/BlackBackground.jpg';
import { GETED } from '../../config/statusCode';
import API from '../../API';

const styles = StyleSheet.create({
  img: {
    height: 200,
    width: '100%',
    flex: 1,
  },
});

export default class About extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      pullLoading: false,
      introduce: '',
      createdAt: '',
    };
    this.onRefresh = this.onRefresh.bind(this);
  }

  componentWillMount() {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getUser();
      },
    );
  }

  onRefresh() {
    this.setState(
      {
        pullLoading: true,
      },
      () => {
        this.getUser();
      },
    );
  }

  async getUser() {
    try {
      const result = await API.getUser();
      if (result.statusCode === GETED) {
        this.setState({
          introduce: result.data.introduce,
          createdAt: result.data.createdAt,
        });
      }
      this.setState({
        loading: false,
        pullLoading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
        pullLoading: false,
      });
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
        <Header>
          <Body>
            <Title>About Me</Title>
          </Body>
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={this.state.pullLoading} onRefresh={this.onRefresh} />
          }
        >
          <Card>
            <CardItem>
              <Left>
                <Thumbnail small source={avatar} />
                <Body>
                  <Text>feather</Text>
                  <Text note>{new Date(this.state.createdAt).toLocaleString()}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem cardBody>
              <Body>
                <Image source={background} style={styles.img} />
              </Body>
            </CardItem>
            <CardItem>
              <Body>
                {this.state.loading ? <Spinner color="blue" /> : null}
                <Markdown>{this.state.introduce}</Markdown>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}
