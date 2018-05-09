import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl } from 'react-native';
import { Content, Spinner, Toast, Card, CardItem, Body, Text } from 'native-base';
import { GETED } from '../../config/statusCode';
import API from '../../API';
import ArticleOverview from '../ArticleOverview';

class ArticleList extends React.Component {
  constructor() {
    super();
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
    this.onRefresh = this.onRefresh.bind(this);
    this.scrollLoading = this.scrollLoading.bind(this);
  }

  componentWillMount() {
    this.setState(
      {
        loading: true,
      },
      () => {
        this.getArticlesData();
      },
    );
  }

  onRefresh() {
    this.setState(
      {
        pullLoading: true,
      },
      () => {
        this.getArticlesData();
      },
    );
  }

  getArticlesData() {
    if (this.props.params.key) {
      this.setState({ key: this.props.params.key }, () => {
        this.getArticles();
      });
    } else if (this.props.params.type) {
      this.getArticlesByTypes(this.props.params.type);
    } else if (this.props.params.tag) {
      this.getArticlesByTags(this.props.params.tag);
    } else if (this.props.params.date) {
      this.getArticlesByArchive(this.props.params.date);
    } else {
      this.getArticles();
    }
  }

  async getArticles(parameter) {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getArticles({ parameter, params });
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
        text: error.message,
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  async getArticlesByTypes(parameter) {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getArticlesByTypes({ parameter, params });
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
        text: error.message,
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  async getArticlesByTags(parameter) {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getArticlesByTags({ parameter, params });
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
        text: error.message,
        position: 'bottom',
        duration: 3000,
      });
    }
  }

  async getArticlesByArchive(parameter) {
    try {
      const params = {
        page: this.state.page,
        limit: this.state.limit,
        order: this.state.order,
        key: this.state.key,
      };
      const result = await API.getArticlesByArchive({ parameter, params });
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
        text: error.message,
        position: 'bottom',
        duration: 3000,
      });
    }
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
            this.getArticlesData();
          },
        );
      }
    }
  }

  render() {
    return (
      <Content
        scrollEventThrottle={300}
        onScroll={this.scrollLoading}
        refreshControl={
          <RefreshControl refreshing={this.state.pullLoading} onRefresh={this.onRefresh} />
        }
      >
        {this.state.articles.map(article => (
          <ArticleOverview key={article.aid} data={article} navigation={this.props.navigation} />
        ))}
        {this.state.loading ? <Spinner color="blue" /> : null}
        {this.state.articles.length === 0 && !this.state.loading ? (
          <Card>
            <CardItem>
              <Body>
                <Text>no more</Text>
              </Body>
            </CardItem>
          </Card>
        ) : null}
      </Content>
    );
  }
}

ArticleList.propTypes = {
  params: PropTypes.objectOf(PropTypes.string).isRequired,
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ArticleList;
