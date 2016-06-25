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
        category: {}
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
        this.updateState('category', categories);
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
                        <li className="icon-col" key={id} data-id={id} data-type={state.menus['topmenu'][id].type} >
                            <Link to={state.menus['topmenu'][id].type} params={ {name: state.menus['topmenu'][id].label} } >{state.menus['topmenu'][id].label}</Link><i className="icon-cancel-squared f-right" data-id={id} data-type={state.menus['topmenu'][id].type} onClick={this.removeFromTopMenu}></i>
                        </li>
                    );
                }

                if( !!state.category && !!state.category ){
                    categories = Object.keys(state.category).map(id => 
                        <li key={id} data-id={id} data-type="category" onClick={this.addToTopMenu}>{state.category[id]}</li>
                    );
                }

                return <div className='row'>
                    <article>
                        <h1>Menus</h1>
                        <p>Edit menus here. On left will be collapsable list of pages, posts, categories, and custom links. On right is menu name / title and links added to the menu.</p>
                        <div className="row table-borders">
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

    removeFromMenu = (menuName, item) => {
        if(!menuName || !item){
            return;
        }
        var type = item.getAttribute('data-type'),
            id = item.getAttribute('data-id');

        API.menus.child(menuName+'/'+id).remove();
    }

    removeFromTopMenu = (evt) => {
        this.removeFromMenu('topmenu', evt.target);
    }

    addToMenu = (menuName, item) => {
        if(!menuName || !item){
            return;
        }

        var type = item.getAttribute('data-type'),
            id = item.getAttribute('data-id');

        if( !this.state.menus[menuName][id] && !!this.state[type] && !!this.state[type][id] ){
            let newMenuItem = {
                id: id,
                type: type,
                label: this.state[type][id],
                stamp: Date.now()
            };

            API.menus.child(menuName).push(newMenuItem);
        }
    }

    addToTopMenu = (evt) => {
        this.addToMenu('topmenu', evt.target)
    }
}
