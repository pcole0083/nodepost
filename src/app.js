import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import App from './components/App';
import Post from './components/Post';
import NewPost from './components/NewPost';
import Home from './components/Home';
import Account from './components/Account';
import Menus from './components/Menus';

const {Route} = Router; //gets the Route property from Router

var routes = <Route handler={App}>
	<Route name='home' path='/' handler={Home} />
	<Route name='post' path='/post/:id' handler={Post} />
	<Route name='page' path='/page/:id' handler={Post} />
	<Route name='new' path='/new' handler={NewPost} />
	<Route name='account' path='/account' handler={Account} />
	<Route name='menus' path='/menus' handler={Menus} />
</Route>;

Router.run(routes, Router.HistoryLocation, Root =>
	ReactDOM.render(<Root />, document.querySelector('#app') )
);