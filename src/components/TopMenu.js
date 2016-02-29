//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';

export default class TopMenu extends React.Component {
    state = {
    	loaded: false,
    	categories: {}
    }

    constructor(props, context) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
    	API.categories.on('value', ss => this.setState({
    		categories: ss.exportVal() || {},
    		loaded: true
    	}));
    }

    render() {
    	let items = !!this.state.loaded ? Object.keys(this.state.categories).map(id => 
            <li key={id} className='menu-item'>
                <Link to='category' params={ {name: this.state.categories[id]} } className='menu-link' >{this.state.categories[id]}</Link>
    	   </li>
        ):
    	[<li key='loading' className='menu-item'><em>Loading...</em></li>];

        let loginLink = !!this.props.user && !!this.props.user.username ? <Link to='login' className="menu-link"><i className="icon-user"></i></Link> : <Link to='login' className="menu-link"><i className="icon-user"></i></Link>; 

        return <nav className="top-nav">
        	<ul className="nav-list">
                {items}
                <li className="menu-item">{loginLink}</li>
            </ul>
        </nav>;
    };
}

TopMenu.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
