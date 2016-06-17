//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';

export default class PostList extends React.Component {
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

    render() {
        let posts = this.state.posts;
    	let items = !!this.state.loaded ? Object.keys(posts).map(id => {
            let post = posts[id];
            return <li key={id} className='link-list'>
        		<div className="row">
                    <span className="one columns"><input type='radio' name='homepage' className='link-list-radio' data-id={id} onChange={this.updateHome} checked={post.homepage} /></span>
                    <span className='four columns'><Link to='post' params={ {id: id} } className='link-list-item' >{post.title}</Link></span>
                    <span className='one columns'>{Object.keys(post.authors).map(ad => {return post.authors[ad]}).join(', ')}</span>
                    <span className='two columns'>{Object.keys(post.categories).map(ad => {return post.categories[ad]}).join(', ')}</span>
                    <span className='two columns'>{Object.keys(post.tags).map(ad => {return post.tags[ad]}).join(', ')}</span>
                    <span className='two columns'>{new Date(post.updated).toLocaleString()}</span>
                </div>
        	</li>
        }):
    	[<li key='loading'><em> Loading... </em></li>];

        return <div className="fade-in">
        	<ul className="table-set">
                <li className='link-list title-row'>
                    <div className="row">
                        <span className="one columns"><i className="icon-home" title="Home Post"></i></span>
                        <span className='four columns'>Post Title</span>
                        <span className='one columns'>Author</span>
                        <span className='two columns'>Categories</span>
                        <span className='two columns'>Tags</span>
                        <span className='two columns'>Updated</span>
                    </div>
                </li>
                {items}
            </ul>
        </div>;
    }

    updateHome = evt => {
        var homeId = evt.target.getAttribute('data-id');
        if(!!homeId){
            Object.keys(this.state.posts).forEach(id =>
                API.posts.child(id).update({
                    homepage: homeId === id
                })
            );
        }
    }
}

PostList.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
