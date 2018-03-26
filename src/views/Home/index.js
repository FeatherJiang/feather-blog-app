import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Button, Text, Spinner, Toast, Card, CardItem, Body } from 'native-base';
import ArticleOverview from '../../components/ArticleOverview';
import { GETED } from '../../config/statusCode';
import API from '../../API';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      pullLoading: false,
      page: 1,
      limit: 10,
      count: 0,
      order: 'DESC',
      key: '',
      articles: [],
    };
    this.searchHandle = this.searchHandle.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.scrollLoading = this.scrollLoading.bind(this);
  }

  componentWillMount() {
    this.setState({
      loading: true,
    }, () => {
      this.getArticles();
    });
  }

  onRefresh() {
    this.setState({
      pullLoading: true,
    }, () => {
      this.getArticles();
    });
  }

  async getArticles() {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getArticles({ params });
      if (result.statusCode === GETED) {
        this.setState({
          count: result.data.count,
          articles: result.data.rows,
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

  scrollLoading(event) {
    const scrollHeight = event.nativeEvent.contentOffset.y +
    event.nativeEvent.layoutMeasurement.height;
    if (scrollHeight >= event.nativeEvent.contentSize.height) {
      if ((this.state.count - (this.state.page * this.state.limit) >= 1)
      && this.state.loading === false) {
        this.setState(preState => ({
          loading: true,
          limit: (preState.page + 1) * preState.limit,
        }), () => {
          this.getArticles();
        });
      }
    }
  }

  searchHandle() {
    if (this.state.key) {
      this.props.navigation.navigate('page', { key: this.state.key });
    } else {
      Toast.show({
        text: 'search key is required',
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="search" />
            <Input placeholder="Search" onChangeText={(text) => { this.setState({ key: text }); }} />
          </Item>
          <Button transparent onPress={this.searchHandle}>
            <Text>Search</Text>
          </Button>
        </Header>
        <Content
          scrollEventThrottle={300}
          onScroll={this.scrollLoading}
          refreshControl={<RefreshControl
            refreshing={this.state.pullLoading}
            onRefresh={this.onRefresh}
          />}
        >
          {
            this.state.articles.map(article => (
              <ArticleOverview
                key={article.aid}
                data={article}
                navigation={this.props.navigation}
              />
            ))
          }
          {
            this.state.loading ? <Spinner color="blue" /> : null
          }
          {
            this.state.articles.length === 0 && !this.state.loading ?
              <Card>
                <CardItem>
                  <Body>
                    <Text>no more</Text>
                  </Body>
                </CardItem>
              </Card> : null
          }
        </Content>
      </Container>
    );
  }
}

Home.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Home;
