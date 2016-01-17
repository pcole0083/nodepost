//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';

export default class PostList extends React.Component {
    state = {
    	loaded: false,
    	posts: {},
    	newpostTitle: '',
        newPost: {
            type:       '',
            title:      '', 
            content:    'Your text here',
            categories: '',
            tags:       '',
            authors:    '',
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

    componentDidMount() {
    	API.posts.on('value', ss => this.setState({
    		posts: ss.exportVal() || {},
    		loaded: true
    	}));
    }

    render() {
    	let items = !!this.state.loaded ? Object.keys(this.state.posts).map(id => <li key={id} className='link-list'>
    		<input type='radio' name='homepage' className='link-list-radio' data-id={id} onChange={this.updateHome} checked={this.state.posts[id].homepage} />
            <Link to='post' params={ {id: id} } className='link-list-item' >{this.state.posts[id].title}</Link>
    	</li>):
    	[<li key='loading'><em> Loading... </em></li>];

        let id = Object.keys(this.state.posts).filter(id => {
            return window.location.href.indexOf(id) > -1;
        });

        let placeholder = 'New Post Title';

        return <div>
        	<ul> {items} </ul>
        </div>;
    };
    update = evt => {
        let newPost = this.state.newPost
        newPost.title = !!evt && !!evt.target ? evt.target.value : '';
        this.setState({'newPost': newPost});
    };
    createpost = evt => {
    	if( evt.charCode !== 13 ){
    		return;
    	}
    	var id = API.posts.push(this.state.newPost);
        API.posts.child(id).set({
            'slug': id
        });
        this.context.router.transitionTo('post', { id: id.key() });

        this.update();
    };
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

PostList.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
