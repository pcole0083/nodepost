//library imports
import React from 'react';
import * as RR from 'react-router';
const {Link} = RR;
const {RouteHandler} = RR;
//custom imports
import Login    from './Login';
import Postlist from './PostList';
import Account  from './Account';
import Home     from './Home';
import Admin    from './Admin';

class App extends React.Component {
	state = {
		user: USER
	}
    render() {
        return <div>
            <div className="row">
                <div className="three columns">
                    <h1><Link to="/">NodePost</Link></h1>
                </div>
                <div className="nine columns"></div>
            </div>
        	<div className="row">
        		<div className="three columns">
                    <Login user={this.state.user} setUser={this.setUser} />
        			<Postlist user={this.state.user} />
        		</div>
        		<div className="nine columns">
        			<RouteHandler user={this.state.user} />
        		</div>
        	</div>
            <Admin user={this.state.user} />
        </div>;
    }
    setUser = (user) => this.setState({ user: user })
}

export default App;
