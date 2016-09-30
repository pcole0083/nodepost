//library imports
import React from 'react';
import * as RR from 'react-router';
const {Link} = RR;
const {RouteHandler} = RR;
//custom imports
import * as API from '../api';
import * as AppDispatcher from '../dispatchers/AppDispatcher';
import LoginStatus    from '../helpers/LoginStatus';
import Menu  from './Menu';
import Account  from './Account';
import Home     from './Home';
import Admin    from './Admin';

export default class App extends React.Component {
	state = {
		user: {},
        title: '',
        tagline: ''
	}

    componentDidMount() {
        AppDispatcher.registerLogin.call(this);
        
        API.settings.child('site_title').on('value', this.getTitle);
        API.settings.child('tagline').on('value', this.getTagline);

        if(!!this.props && !!this.props.user && !!this.props.user.uid){
            API.users.child(this.props.user.uid).once('value', this.updateContent);
        }
        else {
            LoginStatus.userCheck.call(this);
        }
    }

    componentWillUnmount(){
        API.settings.off('value');
        if(!!this.cleanup){
            this.cleanup()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps && !!nextProps.user && !!nextProps.user.uid){
            API.users.child(nextProps.user.uid).once('value', this.updateContent);
        }
    }

    updateState = (user, title, tagline) => {
        this.setState({
            title: title,
            tagline: tagline,
            user: user
        });
    }

    getTitle = (ss) => {
        let site_title = ss.exportVal();
        this.updateState(this.state.user, site_title.value, this.state.tagline);
    }

    getTagline = (ss) => {
        let tagline = ss.exportVal();
        this.updateState(this.state.user, this.state.title, tagline.value);
    }

    updateContent = (ss) => {
        let json = ss.exportVal();
        this.updateState(json, this.state.title, this.state.tagline);
    }

    render() {
        return <div className="page-wrapper">
            <header className="header">
                <div className="row">
                    <div className="tweleve columns">
                        <h1 className="site-title"><Link to="/">{this.state.title}</Link></h1>
                        <p className="tagline">{this.state.tagline}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="tweleve columns">
                        <Menu user={this.state.user} menuid="topmenu" />
                    </div>
                </div>
            </header>
        	<div className="row page">
        		<div className="twelve columns content">
        			<RouteHandler user={this.state.user} />
        		</div>
        	</div>
            <footer className="footer">
                <div className="row">
                    <div className="tweleve columns">
                        <Menu user={this.state.user} menuid="footermenu" />
                    </div>
                </div>
            </footer>
            <Admin user={this.state.user} dispatcher={AppDispatcher.dispatcher} /> 
        </div>;
    }

    setUser = (user) => this.setState({ user: user })

}
