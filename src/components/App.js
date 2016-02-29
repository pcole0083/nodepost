//library imports
import React from 'react';
import * as RR from 'react-router';
const {Link} = RR;
const {RouteHandler} = RR;
//custom imports
import * as API from '../api';
import * as AppDispatcher from '../dispatchers/AppDispatcher';
import Login    from './Login';
import TopMenu  from './TopMenu';
import Postlist from './PostList';
import Account  from './Account';
import Home     from './Home';
import Admin    from './Admin';

class App extends React.Component {
	state = {
		user: {}
	}

    componentDidMount() {
        if(!!this.props && !!this.props.user && !!this.props.user.uid){
            API.users.child(this.props.user.uid).once('value', this.updateContent);
        }
        AppDispatcher.registerLogin.call(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!!nextProps && !!nextProps.user && !!nextProps.user.uid){
            API.users.child(nextProps.user.uid).once('value', this.updateContent);
        }
    }

    updateContent = (snapshot) => {
        let json = snapshot.exportVal();

        this.setState({
            user: json
        });
    }

    render() {
        return <div className="page-wrapper">
                <Admin user={this.state.user} dispatcher={AppDispatcher.dispatcher} /> 
            <header className="row header">
                <div className="three columns">
                    <h1 className="site-title"><Link to="/">NodePost</Link></h1>
                </div>
                <div className="nine columns">
                    <TopMenu user={this.state.user} />
                </div>
            </header>
        	<div className="row">
        		<div className="twelve columns">
        			<RouteHandler user={this.state.user} />
        		</div>
        	</div>
        </div>;
    }

    setUser = (user) => this.setState({ user: user })

    // registerLogin(){
    //     var LoginToken = AppDispatcher.register({}, (payload) => {
    //         if (payload.actionType === 'status-login') {
    //             let userData = API.ref.getAuth();
    //             if(!!userData) {
    //                 API.auth.getUser(userData.uid, (snapshot) => {
    //                     let user = snapshot.exportVal();

    //                     this.setState({
    //                         user: user
    //                     });
    //                 });

    //                 AppDispatcher.dispatcher.unregister(LoginToken);
    //                 this.registerLogout.call(this);
    //             }
    //         }
    //     });
    // }
    // registerLogout(){
    //     var LoggoutToken = AppDispatcher.register({}, (payload) => {
    //         if (payload.actionType === 'status-logout') {
    //             this.setState({
    //                 user: {}
    //             });
    //             AppDispatcher.dispatcher.unregister(LoggoutToken);
    //             this.registerLogin.call(this);
    //         }
    //     });
    // }

}

export default App;
