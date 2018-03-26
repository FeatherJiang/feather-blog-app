import { StackNavigator, TabNavigator } from 'react-navigation';
import Home from '../views/Home';
import Types from '../views/Types';
import Tags from '../views/Tags';
import Archive from '../views/Archive';
import About from '../views/About';
import TabBar from '../components/TabBar';
import Page from '../views/Page';
import Article from '../views/Article';
import Comments from '../views/Comments';
import CommentForm from '../views/CommentForm';

export default StackNavigator(
  {
    index: {
      screen: TabNavigator(
        {
          home: { screen: Home },
          types: { screen: Types },
          tags: { screen: Tags },
          archive: { screen: Archive },
          about: { screen: About },
        },
        {
          tabBarPosition: 'bottom',
          tabBarComponent: TabBar,
          animationEnabled: true,
          swipeEnabled: true,
        },
      ),
    },
    page: { screen: Page },
    article: { screen: Article },
    comments: { screen: Comments },
    commentForm: { screen: CommentForm },
  },
  {
    initialRouteName: 'index',
    headerMode: 'none',
  },
);

