import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import {
  Container,
  Header,
  Body,
  Title,
  Content,
  Card,
  CardItem,
  Icon,
  Left,
  Right,
  Text,
  Spinner,
  Toast,
  Badge,
} from 'native-base';
import { GETED } from '../../config/statusCode';
import API from '../../API';

class Archive extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      pullLoading: false,
      archive: [],
    };
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getArchive();
      },
    );
  }

  onRefresh() {
    this.setState(
      {
        pullLoading: true,
      },
      () => {
        this.getArchive();
      },
    );
  }

  async getArchive() {
    try {
      const result = await API.getArchive();
      if (result.statusCode === GETED) {
        this.setState({
          archive: result.data,
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
            <Title>Archive</Title>
          </Body>
        </Header>
        <Content
          refreshControl={
            <RefreshControl refreshing={this.state.pullLoading} onRefresh={this.onRefresh} />
          }
        >
          <Card>
            {this.state.loading ? <Spinner color="blue" /> : null}
            {this.state.archive.map(item => (
              <CardItem
                key={item.time}
                bordered
                button
                onPress={() => this.props.navigation.navigate('page', { date: item.time })}
              >
                <Left>
                  <Icon active name="time" />
                  <Text>{item.time}</Text>
                </Left>
                <Right>
                  <Badge primary>
                    <Text>{item.articleCount}</Text>
                  </Badge>
                </Right>
              </CardItem>
            ))}
            {this.state.archive.length === 0 && !this.state.loading ? (
              <CardItem>
                <Body>
                  <Text>no more</Text>
                </Body>
              </CardItem>
            ) : null}
          </Card>
        </Content>
      </Container>
    );
  }
}

Archive.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Archive;
