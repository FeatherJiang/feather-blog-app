import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import { Container, Header, Body, Title, Content, Card, CardItem, Icon, Left, Right, Text, Spinner, Toast, Badge } from 'native-base';
import { GETED } from '../../config/statusCode';
import API from '../../API';

class Tags extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      pullLoading: false,
      tags: [],
    };
    this.onRefresh = this.onRefresh.bind(this);
  }
  componentWillMount() {
    this.setState({
      loading: true,
    }, () => {
      this.getTags();
    });
  }

  onRefresh() {
    this.setState({
      pullLoading: true,
    }, () => {
      this.getTags();
    });
  }

  async getTags() {
    try {
      const result = await API.getTags();
      if (result.statusCode === GETED) {
        this.setState({
          tags: result.data,
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
        <Header searchBar rounded>
          <Body>
            <Title>Tags</Title>
          </Body>
        </Header>
        <Content
          refreshControl={<RefreshControl
            refreshing={this.state.pullLoading}
            onRefresh={this.onRefresh}
          />}
        >
          <Card>
            {
            this.state.loading ? <Spinner color="blue" /> : null
            }
            {
              this.state.tags.map(tag => (
                <CardItem key={tag.tid} bordered button onPress={() => this.props.navigation.navigate('page', { tag: tag.name })}>
                  <Left>
                    <Icon active name="pricetag" />
                    <Text>{tag.name}</Text>
                  </Left>
                  <Right>
                    <Badge primary>
                      <Text>{tag.articleCount}</Text>
                    </Badge>
                  </Right>
                </CardItem>
              ))
            }
            {
              this.state.tags.length === 0 && !this.state.loading ?
                <CardItem>
                  <Body>
                    <Text>no more</Text>
                  </Body>
                </CardItem> : null
            }
          </Card>
        </Content>
      </Container>
    );
  }
}

Tags.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Tags;
