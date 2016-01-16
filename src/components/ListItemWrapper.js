//library imports
import React from 'react';
//import only the Link property (Destructoring)
import {Link} from 'react-router';

class ListItemWrapper extends React.Component {
	render() {
		var data = this.props.data ? this.props.data : null;
		var link = this.props.link ? this.props.link : null;
		var className = this.props.className ? this.props.className : null;

		if(!!link){
			return <li className={className}>
						<Link to={link.to} >{link.text}</Link>
					</li>;
		}
		return <li className={className}>{data}</li>;
	}
}

export default ListItemWrapper;