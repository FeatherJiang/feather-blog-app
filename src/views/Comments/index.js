import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Right,
  Icon,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Spinner,
  Toast,
  Fab,
} from 'native-base';
import config from '../../config';
import { GETED } from '../../config/statusCode';
import API from '../../API';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pullLoading: false,
      page: 1,
      limit: props.navigation.state.params.limit,
      count: 0,
      order: 'DESC',
      comments: [],
    };
    this.onRefresh = this.onRefresh.bind(this);
    this.scrollLoading = this.scrollLoading.bind(this);
  }

  componentWillMount() {
    this.props.navigation.addListener('willFocus', () => {
      this.setState(
        {
          loading: true,
        },
        () => {
          this.getComments(this.props.navigation.state.params.aid);
        },
      );
    });
  }

  onRefresh() {
    this.setState(
      {
        pullLoading: true,
      },
      () => {
        this.getComments(this.props.navigation.state.params.aid);
      },
    );
  }

  async getComments(parameter) {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getComments({ parameter, params });
      if (result.statusCode === GETED) {
        this.setState({
          count: result.data.count,
          comments: this.filterComment(result.data.rows, this.props.navigation.state.params.pid),
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

  filterComment(comments, pid) {
    if (comments instanceof Array) {
      let list = [];
      comments.forEach((comment) => {
        if (comment.pid === pid) {
          list.push(comment);
        }
        if (list.length === 0) {
          list = this.filterComment(comment.children, pid);
        }
      });
      return list;
    }
    return [];
  }

  scrollLoading(event) {
    const scrollHeight =
      event.nativeEvent.contentOffset.y + event.nativeEvent.layoutMeasurement.height;
    if (scrollHeight >= event.nativeEvent.contentSize.height) {
      if (
        this.state.count - this.state.page * this.state.limit >= 1 &&
        this.state.loading === false
      ) {
        this.setState(
          preState => ({
            loading: true,
            limit: (preState.page + 1) * preState.limit,
          }),
          () => {
            this.setState(
              {
                loading: true,
              },
              () => {
                this.getComments(this.props.navigation.state.params.aid);
              },
            );
          },
        );
      }
    }
  }

  render() {
    return (
      <Container>
        <Header>
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
            <Title>Comments</Title>
          </Body>
          <Right />
        </Header>
        <Content
          scrollEventThrottle={300}
          onScroll={this.scrollLoading}
          refreshControl={
            <RefreshControl refreshing={this.state.pullLoading} onRefresh={this.onRefresh} />
          }
        >
          {this.state.comments.map(comment => (
            <Card key={comment.cid}>
              <CardItem>
                <Left>
                  <Thumbnail small source={{ uri: config.baseURL + comment.avatar }} />
                  <Body>
                    <Text>{comment.name}</Text>
                    <Text note>{new Date(comment.createdAt).toLocaleString()}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>{comment.content}</Text>
                </Body>
              </CardItem>
              <CardItem>
                <Left>
                  {comment.children && comment.children.length !== 0 ? (
                    <Button
                      transparent
                      iconLeft
                      onPress={() => {
                        this.props.navigation.navigate('comments', {
                          aid: this.props.navigation.state.params.aid,
                          pid: comment.cid,
                          limit: this.state.limit,
                        });
                      }}
                    >
                      <Text>see reply</Text>
                    </Button>
                  ) : null}
                </Left>
                <Right>
                  <Button
                    transparent
                    iconLeft
                    onPress={() => {
                      this.props.navigation.navigate('commentForm', {
                        aid: this.props.navigation.state.params.aid,
                        pid: comment.cid,
                      });
                    }}
                  >
                    <Icon active name="undo" />
                    <Text>reply</Text>
                  </Button>
                </Right>
              </CardItem>
            </Card>
          ))}
          {this.state.loading ? <Spinner color="blue" /> : null}
        </Content>
        <Fab
          onPress={() => {
            this.props.navigation.navigate('commentForm', {
              aid: this.props.navigation.state.params.aid,
              pid: this.props.navigation.state.params.pid,
            });
          }}
        >
          <Icon active name="undo" />
        </Fab>
      </Container>
    );
  }
}

Comments.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Comments;
