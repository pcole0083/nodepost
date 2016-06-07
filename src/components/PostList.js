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

    render() {
    	let items = !!this.state.loaded ? Object.keys(this.state.posts).map(id => <li key={id} className='link-list'>
    		<input type='radio' name='homepage' className='link-list-radio' data-id={id} onChange={this.updateHome} checked={this.state.posts[id].homepage} />
            <Link to='post' params={ {id: id} } className='link-list-item' >{this.state.posts[id].title}</Link>
    	</li>):
    	[<li key='loading'><em> Loading... </em></li>];

        return <div className="fade-in">
        	<ul>
                <li className='link-list'>
                    <i className="link-list-radio icon-ok-circled2" title="Home Post"></i>
                    <span className='link-list-item'>Post Title</span>
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
