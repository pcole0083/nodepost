//library imports
import React from 'react';
import ListItemWrapper from './ListItemWrapper';
//import the Firebase API
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
//import the Tag component
import Tags from './Tags';

class Category extends React.Component {
    state = {
        loaded: false,
        posts: {}
    }

    constructor(props, context) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
        API.posts.on('value', ss => this.setState({
            posts: ss.exportVal() || {},
            loaded: true
        }));
    }

    filterByCategory(posts){
        var categoryPosts = {};

        Object.keys(posts).forEach(id => {
            var post = posts[id];
            var categories = Object.keys(post.categories).map(function(id) {
                return post.categories[id];
            });
            if( !!~categories.indexOf(this.props.params.name) ){
                categoryPosts[id] = post;
            }
        });
        return categoryPosts;
    }

	render() {
		let category = this.props.params.name;
        let categoryPosts = !!this.state.loaded ? this.filterByCategory(this.state.posts) : this.state.posts;

        let items = !!this.state.loaded ? Object.keys(categoryPosts).map(id => <li key={id} className='category-item'>
            <h3><Link to='post' params={ {id: id} } className='link-list-item' >{this.state.posts[id].title}</Link></h3>
            <div className="post-content short-description">{this.state.posts[id].content.replace('[[', '').replace(']]', '')}</div>
            <Tags data={ this.state.posts[id].tag || {} } />
        </li>):
        [<li key='loading' className='link-list-item'><em> Loading... </em></li>];

        return <div className="category-page">
            <h2 className="capitalize">{category}</h2>
            <ul className="category-post-list">
                {items}
            </ul>
        </div>;
	}
}

export default Category;