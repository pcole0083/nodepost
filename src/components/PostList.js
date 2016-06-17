//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import ReactDOM from 'react-dom';

export default class PostList extends React.Component {
    state = {
    	loaded: false,
    	posts: {},
        deleting: null
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
            let undoId = 'undo_'+id;
            return <li key={id} className='link-list'>
        		<div className="row">
                    <span className="one columns icon-col center">
                        <input type='radio' name='homepage' className='link-list-radio' data-id={id} onChange={this.updateHome} checked={post.homepage} />
                    </span>
                    <span className='three columns'>
                        <Link to='post' params={ {id: id} } className='link-list-item' >{post.title}</Link><br/>
                        <span className="authors-label">Author(s):</span> {Object.keys(post.authors).map(ad => {return post.authors[ad]}).join(', ')}
                    </span>
                    <span className='one columns icon-col center'><i className="icon-clipboard" title="Duplicate" data-id={id} onClick={this.duplicatePost} ></i></span>
                    <span className='two columns'>{Object.keys(post.categories).map(ad => {return post.categories[ad]}).join(', ')}</span>
                    <span className='two columns'>{Object.keys(post.tags).map(ad => {return post.tags[ad]}).join(', ')}</span>
                    <span className='two columns'>{new Date(post.updated).toLocaleString()}</span>
                    <span className='one columns icon-col center'><i className="icon-trash" title="Delete" data-undo-id={undoId} data-id={id} onClick={this.beginDelete} ></i></span>
                </div>
                <div ref={undoId} data-id={id} className="overlay deleting right hidden" onClick={this.undoDelete}>
                    <i className="icon-back" title="Undo"></i><span className="undo">UNDO</span>
                </div>
        	</li>
        }):
    	[<li key='loading'><em> Loading... </em></li>];

        return <div className="fade-in">
        	<ul className="table-set">
                <li className='link-list title-row'>
                    <div className="row">
                        <span className="one columns icon-col center"><i className="icon-home" title="Home Post"></i></span>
                        <span className='three columns'>Post Title</span>
                        <span className='one columns icon-col center'><i className="icon-clipboard" title="Duplicate"></i></span>
                        <span className='two columns'>Categories</span>
                        <span className='two columns'>Tags</span>
                        <span className='two columns'>Updated</span>
                        <span className='one columns icon-col center'><i className="icon-trash" title="Delete"></i></span>
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

    duplicatePost = evt => {
        let postId = evt.target.getAttribute('data-id');
        let post = this.state.posts[postId];
        if(!post){
            return;
        }

        //normally mutating state data is bad, but we are taking advantage of the fact that pushing to posts will cause the list and the state to refresh with new data.
        post.title = post.title+' -- Duplicate --';
        post.slug = post.slug+'-duplicate';
        post.homepage = false;
        API.posts.push(post);
    }

    beginDelete = evt => {
        let postId = evt.target.getAttribute('data-id');
        let undoId = evt.target.getAttribute('data-undo-id');

        if(!postId){
            return;
        }
        let undoBlock = ReactDOM.findDOMNode(this.refs[undoId]);
        if(!undoBlock || undoBlock.classList.contains('fade-in') ){
            return;
        }
        undoBlock.classList.add('fade-in');
        undoBlock.classList.remove('hidden');

        console.log(this.props);

        this.setState({
            loaded: this.state.loaded,
            posts: this.state.posts,
            deleting: setTimeout(function(){
                API.posts.child(postId).remove();
            }, 6010)
        });
    }

    undoDelete = evt => {
        let undoOverlay = evt.target;

        clearTimeout(this.state.deleting);

        this.setState({
            deleting: null
        });

        if( !undoOverlay.classList.contains('overlay') ){
            undoOverlay = undoOverlay.parentElement;
        }

        if( undoOverlay.classList.contains('fade-out') ){
            return;
        }

        undoOverlay.classList.remove('fade-in');
        undoOverlay.classList.add('fade-out');

        setTimeout(function(){
            undoOverlay.classList.add('hidden');
            undoOverlay.classList.remove('fade-out');
        }, 1999);
        
    }
}

PostList.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
