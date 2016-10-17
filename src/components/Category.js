//library imports
import React from 'react';
import ListItemWrapper from './ListItemWrapper';
//import the Firebase API
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
//import the Tag component
import ShortPost from './ShortPost';

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

    componentWillUnmount(){
        API.posts.off('value');
        if(!!this.cleanup){
            this.cleanup()
        }
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

        let items = !!this.state.loaded ? Object.keys(categoryPosts).map(id => 
            <ShortPost key={id} slug={this.state.posts[id].slug} title={this.state.posts[id].title} link={{id: id, to: 'post'}} text={this.state.posts[id].content.replace('[[', '').replace(']]', '')} tags={this.state.posts[id].tags} />
        ):
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