import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router';
import App from './components/App';
import Login from './components/Login';
import Post from './components/Post';
import NewPost from './components/NewPost';
import Category from './components/Category';
import PostList from './components/PostList';
import Home from './components/Home';
import Account from './components/Account';
import Menus from './components/Menus';
import Settings from './components/Settings';
import Users from './components/Users';

const {Route} = Router; //gets the Route property from Router

var routes = <Route handler={App}>
	<Route name='home' path='/' handler={Home} />
	<Route name='login' path='/login' handler={Login} />
	<Route name='post' path='/post/:slug' handler={Post} />
	<Route name='page' path='/page/:slug' handler={Post} />
	<Route name='category' path='/category/:name' handler={Category} />
	<Route name='postlist' path='/posts' handler={PostList} />
	<Route name='new' path='/new' handler={NewPost} />
	<Route name='account' path='/account' handler={Account} />
	<Route name='menus' path='/menus' handler={Menus} />
	<Route name='settings' path='/settings' handler={Settings} />
	<Route name='users' path='/users' handler={Users} />
</Route>;

Router.run(routes, Router.HistoryLocation, Root =>
	ReactDOM.render(<Root />, document.querySelector('#app') )
);