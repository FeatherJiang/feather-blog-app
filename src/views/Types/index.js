import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Title, Body, Toast, Tabs, Tab, ScrollableTab } from 'native-base';
import { GETED } from '../../config/statusCode';
import API from '../../API';
import ArticleList from '../../components/ArticleList';

class Types extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      types: [],
    };
  }

  componentWillMount() {
    this.getTypes();
  }

  async getTypes() {
    try {
      const result = await API.getTypes();
      if (result.statusCode === GETED) {
        this.setState({
          types: result.data,
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
          <Body>
            <Title>Types</Title>
          </Body>
        </Header>
        <Tabs renderTabBar={() => <ScrollableTab />}>
          {
            this.state.types.map(type => (
              <Tab key={type.tid} heading={type.name}>
                <ArticleList params={{ type: type.name }} navigation={this.props.navigation} />
              </Tab>
            ))
          }
        </Tabs>
      </Container>
    );
  }
}

Types.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Types;
