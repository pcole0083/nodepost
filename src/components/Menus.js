//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//custom imports
import * as API from '../api';
import {Link} from 'react-router';
import isAdmin from '../helpers/isAdmin';

export default class Menus extends React.Component {
    state = { 
        user: {},
        menus: {},
        categories: {}
    }

    componentDidMount() {
        API.menus.orderByValue().on('value', this.updateMenus);
        API.categories.orderByValue().once('value', this.loadCategories);
    }

    componentWillUnmount(){
        API.menus.off('value');
        if(!!this.cleanup){
            this.cleanup();
        }
    }

    updateState = (name, value) => {
        let newState = this.state;
        newState[name] = value;
        this.setState(newState);
    }

    loadCategories = (ss) => {
        let categories = ss.exportVal();
        this.updateState('categories', categories);
    }

    updateMenus = (ss) => {
        let menus = ss.exportVal();
        this.updateState('menus', menus);
    }

    render() {
        let state = this.state || {};
        let topmenu = '';
        let adminUser = false;
        let categories = '';

        if (!!this.props.user && !!this.props.user.username){

            if(!!this.props.user.groups) {
                adminUser = isAdmin(this.props.user.groups);
            }

            if(adminUser) {
                if( !!state.menus && !!state.menus['topmenu'] ){
                    topmenu = Object.keys(state.menus['topmenu']).map(id => 
                        <li key={id} data-id={id} data-type={state.menus['topmenu'][id].type} >
                            <Link to={state.menus['topmenu'][id].type} params={ {name: state.menus['topmenu'][id].label} } >{state.menus['topmenu'][id].label}</Link>
                        </li>
                    );
                }

                if( !!state.categories && !!state.categories ){
                    categories = Object.keys(state.categories).map(id => 
                        <li key={id} data-id={id} data-type="category" onClick={this.addToMenu}>{state.categories[id]}</li>
                    );
                }

                return <div className='row'>
                    <article>
                        <h1>Menus</h1>
                        <p>Edit menus here. On left will be collapsable list of pages, posts, categories, and custom links. On right is menu name / title and links added to the menu.</p>
                        <div className="row">
                            <div className="six columns">
                                <h2>Top Menu</h2>
                                <ul>{topmenu}</ul>
                            </div>
                            <div className="six columns">
                                <h2>Categoires</h2>
                                <ul>{categories}</ul>
                            </div>
                        </div>
                    </article>
                </div>;
            }
        }
        return <div className='row'></div>;
    }

    addToMenu = (evt) => {
        var item = evt.target,
            type = item.getAttribute('data-type'),
            id = item.getAttribute('data-id');

        if( !!this.state[type] && !!this.state[type][id] ){
            let newMenuItem = {
                id: id,
                type: type,
                label: this.state[type][id],
                stamp: Date.now()
            };

            API.menus.child('topmenu').push(newMenuItem);
        }
    }
}
