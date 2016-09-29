//library imports
import React from 'react';
//custom imports
import * as API from '../api';
//import only the Link property (Destructoring)
import {Link} from 'react-router';

export default class Menu extends React.Component {
    state = {
    	loaded: false,
    	menuitems: {}
    }

    constructor(props, context) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
    	API.menus.child(this.props.menuid).on('value', ss => this.setState({
    		menuitems: ss.exportVal() || {},
    		loaded: true
    	}));
    }

    render() {
    	let items = !!this.state.loaded ? Object.keys(this.state.menuitems).map(id => 
            <li key={id} className='menu-item'>
                <Link to='category' params={ {name: this.state.menuitems[id].label} } className='menu-link' >{this.state.menuitems[id].label}</Link>
    	   </li>
        ):
    	[<li key='loading' className='menu-item'><em>Loading...</em></li>];

        //let loginLink = !!this.props.user && !!this.props.user.username ? <Link to='login' className="menu-link"><i className="icon-user"></i></Link> : <Link to='login' className="menu-link"><i className="icon-user"></i></Link>; 
        //<li className="menu-item">{loginLink}</li>
        return <nav className="nav-menu">
        	<ul className="nav-list">
                {items}
            </ul>
        </nav>;
    };
}

Menu.contextTypes = { 
    router: React.PropTypes.func.isRequired
};
