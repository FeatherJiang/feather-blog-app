import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Title,
  Right,
  Button,
  Text,
  Icon,
  Card,
  CardItem,
  Form,
  Item,
  Label,
  Input,
  Thumbnail,
  Toast,
  Spinner,
} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import config from '../../config';
import { CREATED } from '../../config/statusCode';
import API from '../../API';

const styles = StyleSheet.create({
  form: {
    width: '100%',
  },
  comment: {
    height: 200,
  },
});

class CommentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      avatar: '/v1/imgs/default/anonymous-avatar.png',
      name: '',
      email: '',
      content: '',
      commentError: false,
      loading: false,
    };
    this.uploadImg = this.uploadImg.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  uploadImg() {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        Toast.show({
          text: response.didCancel,
          position: 'bottom',
          duration: 3000,
        });
      } else if (response.error) {
        Toast.show({
          text: response.error,
          position: 'bottom',
          duration: 3000,
        });
      } else if (response.customButton) {
        Toast.show({
          text: response.error,
          position: 'bottom',
          duration: 3000,
        });
      } else {
        const file = { uri: response.uri, type: 'multipart/form-data', name: 'image.png' }; // 这里的key(uri和type和name)不能改变,
        this.addAvatar(file);
      }
    });
  }

  async addAvatar(file) {
    try {
      const data = new FormData();
      data.append('file', file);
      const result = await API.postImgs({
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data,
      });
      if (result.statusCode === CREATED) {
        this.setState({
          avatar: config.baseURL + result.data[0].url,
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

  async addComment() {
    this.setState({ loading: true });
    if (this.state.content === '') {
      this.setState({
        commentError: false,
        loading: false,
      });
      return;
    }
    const json = {
      pid: this.props.navigation.state.params.pid,
      avatar: this.state.avatar.replace(config.baseURL, ''),
      name: this.state.name || 'anonymous',
      email: this.state.email,
      content: this.state.content,
    };
    try {
      const result = await API.postComment({
        parameter: this.props.navigation.state.params.aid,
        data: json,
      });
      if (result.statusCode === CREATED) {
        this.setState({ loading: false });
        this.props.navigation.goBack();
      }
    } catch (error) {
      this.setState({ loading: false });
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
            <Title>Reply</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Card>
            <CardItem>
              <Left>
                <Thumbnail source={{ uri: config.baseURL + this.state.avatar }} />
              </Left>
              <Right>
                <Button small onPress={this.uploadImg}>
                  <Text>Change Avatar</Text>
                </Button>
              </Right>
            </CardItem>
            <CardItem>
              <Body>
                <Form style={styles.form}>
                  <Item stackedLabel last>
                    <Label>Name</Label>
                    <Input
                      placeholder="Optional"
                      onChangeText={text => this.setState({ name: text })}
                    />
                  </Item>
                  <Item stackedLabel last>
                    <Label>Email</Label>
                    <Input
                      placeholder="Optional"
                      onChangeText={text => this.setState({ email: text })}
                    />
                  </Item>
                  <Item stackedLabel last error={this.state.commentError} style={styles.comment}>
                    <Label>Comment</Label>
                    <Input
                      placeholder="Required"
                      multiline
                      numberOfLines={5}
                      onChangeText={(text) => {
                        if (text === '') {
                          this.setState({ commentError: true });
                        } else {
                          this.setState({ commentError: false });
                        }
                        this.setState({ content: text });
                      }}
                    />
                  </Item>
                </Form>
              </Body>
            </CardItem>
            <CardItem footer>
              <Body>
                <Button block disabled={this.state.loading} onPress={this.addComment}>
                  {this.state.loading ? <Spinner color="blue" /> : <Text>Submit</Text>}
                </Button>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

CommentForm.propTypes = {
  pid: PropTypes.number.isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CommentForm;
