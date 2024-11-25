import { combineReducers, createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';
import thunk from 'redux-thunk';
import app from './reducers/app';
import auth from './reducers/auth';
import search from './reducers/search';
import profile from './reducers/profile';
import currentProperty from './reducers/currentProperty';
import usersProperties from './reducers/usersProperties';
import favourites from './reducers/favourites';
import inbox from './reducers/inbox';


const rootReducer = combineReducers({
  app,
  auth,
  search,
  profile,
  currentProperty,
  usersProperties,
  favourites,
  inbox
});

// const composeEnhancers = composeWithDevTools({realtime: true, port: 3006, hostname: '172.20.10.8'});

const store = createStore(rootReducer, applyMiddleware(thunk));

export type IRootState = ReturnType<typeof rootReducer>;

export default store;
