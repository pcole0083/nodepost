//library imports
import React from 'react';
//import only the Link property (Destructoring)
import {Link} from 'react-router';
//import the Tag component
import Tags from './Tags';

export default class ShortPost extends React.Component {
	render() {
		var text = this.props.text ? this.props.text : null;
		var title = this.props.title ? this.props.title : null;
		var link = this.props.link ? this.props.link : null;
		var tags = this.props.tags ? this.props.tags : {};
		var tagsClass = !tags ? 'tag-title hidden' : 'tag-title';

		var className = this.props.className ? this.props.className : null;

		if(!!link){
			return <li className={className}>
				<h3><Link to={link.to} params={ {id: link.id} } className='link-list-item'>{title}</Link></h3>
				<div className="post-content short-description">{text}</div>
				<span className={tagsClass} >Tags:</span>
				<Tags datatype="tags" data={ tags } />
			</li>;
		}
		return <li className={className}>
			<h3>{title}</h3>
			<div className="post-content short-description">{text}</div>
			<span className={tagsClass} >Tags:</span>
			<Tags datatype="tags" data={ tags } />
		</li>;
	}
}