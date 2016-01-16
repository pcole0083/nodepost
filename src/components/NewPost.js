//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
import Tags from './Tags';
import Categories from './Categories';
import EditableElement from './EditableElement';

export default class NewPost extends React.Component {
    state = {
        user: this.props.user,
    	loaded: false,
    	newpostTitle: '',
        newPost: {
            type:       'post',
            title:      '', 
            content:    'Your text here',
            categories: [],
            tags:       [],
            authors:    [],
            status:     'draft',
            visibility: 'visibile',
            image:      '',
            slug:       ''
        }
    }

    constructor(props, context) {
        super(props, context);
        this.context = context;
    }

    render() {
        if(this.state.user) {
            return <article className="post-article">
                <h1><EditableElement content={this.state.newpostTitle} update={this.update} editing={this.state.user} name='title' placeholder='Enter Title' /></h1>
                <h2><input type='text' className='u-full-width input-slug' name="slug" ref="slug" defaultValue={this.state.newPost.slug} placeholder='Unique Slug' onChange={this.update} /></h2>
                <p><input type='text' className='u-full-width input-type' name="type" defaultValue={this.state.newPost.type} placeholder='Custom Post Type' onChange={this.update} /></p>
                <p><textarea className='u-full-width input-content' name="content" placeholder={this.state.newPost.content} onChange={this.update}></textarea></p>
                <h4 className="tag-title">Authors</h4>
                <Tags data={this.state.newPost.authors} />
                <p><input type='text' className='u-full-width input-authors' name="authors" defaultValue={this.state.user.username} placeholder='Author Names' onKeyPress={this.updateArrayData} /></p>
                <h4 className="tag-title">Tags</h4>
                <Tags data={this.state.newPost.tags} />
                <p><input type='text' className='u-full-width input-tags' name="tags" placeholder='Add Tags' onKeyPress={this.updateArrayData} /></p>
                <h4 className="cats-title">Categories</h4>
                <Categories data={this.state.newPost.categories} />
                <p><input type='text' className='u-full-width input-categories' name="categories" placeholder='Add Categories' onKeyPress={this.updateArrayData} /></p>
                <p><button onClick={this.createpost}>Create</button></p>
            </article>;
        }
        else {
            return <article className="post-article">Loading...</article>
        }
    };
    update = evt => {
        let newPost = this.state.newPost
        let name = evt.target.name;
        newPost[name] = !!evt && !!evt.target ? evt.target.value : newPost[name];

        if(name === 'title'){
            this.state.newPost.slug = this.generateSlug(newPost[name]);
            ReactDOM.findDOMNode(this.refs.slug).value = this.state.newPost.slug;
        }

        this.setState({'newPost': newPost});
    };

    generateSlug(title){
        return title.replace(/\s+/g, '-').toLowerCase();
    }

    createpost = evt => {
    	if( !this.state.newPost.title ){
            console.error('At least a title is needed');
            React.findDOMNode(this.refs.title).focus();
    		return;
    	}
    	var id = API.posts.push(this.state.newPost);
        this.context.router.transitionTo('post', { id: id.key() });

        this.update(evt);
    };
    updateArrayData = evt => {
        if( evt.charCode !== 13 ){
            return;
        }
        let newPost = this.state.newPost;
        let value   = evt.target.value;
        let name    = evt.target.name;

        if(!!value && newPost[name].push ){
            newPost[name].push(value);
            this.setState({'newPost': newPost});
            evt.target.value = '';
        }
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
    };
}

NewPost.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
