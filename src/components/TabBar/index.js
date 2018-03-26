import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Text,
  Footer,
  FooterTab,
} from 'native-base';

const styles = StyleSheet.create({
  text: {
    fontSize: 8,
  },
});

function TabBar(props) {
  return (
    <Footer>
      <FooterTab>
        <Button
          full
          vertical
          active={props.navigationState.index === 0}
          onPress={() => props.navigation.navigate('home')}
        >
          <Icon active name="home" />
          <Text style={styles.text}>Home</Text>
        </Button>
        <Button
          full
          vertical
          active={props.navigationState.index === 1}
          onPress={() => props.navigation.navigate('types')}
        >
          <Icon active name="bookmark" />
          <Text style={styles.text}>Types</Text>
        </Button>
        <Button
          full
          vertical
          active={props.navigationState.index === 2}
          onPress={() => props.navigation.navigate('tags')}
        >
          <Icon active name="pricetags" />
          <Text style={styles.text}>Tags</Text>
        </Button>
        <Button
          full
          vertical
          active={props.navigationState.index === 3}
          onPress={() => props.navigation.navigate('archive')}
        >
          <Icon active name="calendar" />
          <Text style={styles.text}>Archive</Text>
        </Button>
        <Button
          full
          vertical
          active={props.navigationState.index === 4}
          onPress={() => props.navigation.navigate('about')}
        >
          <Icon active name="paper" />
          <Text style={styles.text}>About</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
}

TabBar.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
  navigationState: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TabBar;
