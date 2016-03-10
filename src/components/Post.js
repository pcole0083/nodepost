//library imports
import React from 'react';
//custom imports
import * as API from '../api';
import {markdown} from 'markdown';

import EditableElement from './EditableElement';
import Tags from './Tags';
import Categories from './Categories';
import isAdmin from './isAdmin';


class Post extends React.Component {
	state = { post: {} }

    componentDidMount() {
        API.posts.child(this.props.params.id).on('value', this.updateContent);
    }

    componentWillReceiveProps(nextProps) {
        API.posts.child(this.props.params.id).off('value', this.updateContent);
        API.posts.child(nextProps.params.id).on('value', this.updateContent);
    }

    updateContent = (snapshot) => {
        let json = snapshot.exportVal();

        this.setState({
            post:       json,
            postid:     snapshot.key(),
            type:       json.type,
            title:      json.title, 
            content:    json.content || '',
            categories: json.categories || [],
            tags:       json.tags || [],
            authors:    json.authors,
            status:     json.status || 'draft',
            visibility: json.visibility || 'visibile',
            image:      json.image || null,
            slug:       json.slug || json.id,
            editing:    false
        });
    }

    render() {
        let content = '';
        let title = '';
        let refTitle = 'title';

        let tagsTitle = '';
        let tags = '';

        let catsTitle = '';
        let cats = '';

        let canEdit = !!this.props.user && !!this.props.user.groups ? isAdmin(this.props.user.groups) : null;

        if(this.state.post.title){ //Data is loaded
            title = <h1><EditableElement 
                            content={this.state.post.title}
                            update={this.update}
                            save={this.save}
                            user={this.props.user}
                            name={refTitle} /></h1>;

            //render content
            if(this.state.content) {
                content = <EditableElement 
                            content={this.state.post.content}
                            
                            save={this.save}
                            user={this.props.user}
                            name='content'
                            inputType='textarea' />
            }

            if(this.state.tags){
                tagsTitle = <h4 className="tag-title">Tags</h4>;
                tags = <Tags postid={this.state.postid} data={this.state.tags} editor={canEdit} />;
            }

            if(this.state.categories){
                catsTitle = <h4 className="cats-title">Categories</h4>;
                cats = <Categories data={this.state.categories} editor={canEdit} />;
            }
        }

        return <article className="post-article">
            {title}
            {content || 'Loading...'}
            <div className="tag-group">
                {tagsTitle}
                {tags}
                {catsTitle}
                {cats}
            </div>
        </article>;
    }
    update = evt => {
        let post = this.state.post
        let name = evt.target.name;
        post[name] = !!evt && !!evt.target ? evt.target.value : post[name];

        this.setState({'post': post});
    }
    save = evt => {
        this.update(evt);
        API.posts.child(this.props.params.id).set(this.state.post);
    }
}

export default Post;
