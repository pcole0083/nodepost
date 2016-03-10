//library imports
import React from 'react';
//custom imports
import * as API from '../api';

import Post from './Post';

class Home extends Post {
	state = { post: {} }

    componentDidMount() {
        let home = API.posts.orderByChild('homepage').equalTo(true);
        home.on('value', this.updateContent);
    }

    componentWillReceiveProps(nextProps) {
        let home = API.posts.orderByChild('homepage').equalTo(true);
        if(!!home){
            home.off('value', this.updateContent);
            home.on('value', this.updateContent);
        }
    }

    updateContent = (snapshot) => {
        let posts = snapshot.exportVal();
        if(!!posts){
            let keys  = Object.keys(posts);
            let json  = posts[keys[0]] //there should ONLY ever be 1 homepage

            this.setState({
                post:       json,
                postid:     keys[0],
                type:       json.type,
                title:      json.title, 
                content:    json.content || '',
                categories: json.categories || [],
                tags:       json.tags || [],
                authors:    json.authors,
                status:     json.status || 'draft',
                visibility: json.visibility || 'visibile',
                image:      json.image || null,
                slug:       json.slug || json.id
            });
        }
    }
}

export default Home;
