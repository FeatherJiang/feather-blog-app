import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header, Body, Title, Left, Right, Button, Icon } from 'native-base';
import ArticleList from '../../components/ArticleList';

function Page(props) {
  return (
    <Container>
      <Header searchBar rounded>
        <Left>
          <Button transparent onPress={() => { props.navigation.goBack(); }}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>
            {
              props.navigation.state.params.tag
              || props.navigation.state.params.date
              || props.navigation.state.params.key
            }
          </Title>
        </Body>
        <Right />
      </Header>
      <ArticleList params={props.navigation.state.params} navigation={props.navigation} />
    </Container>
  );
}

Page.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Page;
