//library imports
import React from 'react';
//import only the Link property (Destructoring)

class PostTitle extends React.Component {

	render() {
		var title = this.props.title ? this.props.title : null;
		var editing = this.props.editing ? this.props.editing : null;
		var startEditing = this.props.editFn ? this.props.editFn : null;
		var updateFn = this.props.update ? this.props.update : null;
		var className = this.props.className ? this.props.className : null;

		if(!!title){
			return <h1 className={className} onClick={startEditing} >
					if(!editing){
						{title}
					}
					else {
                    	<input type='text' className='u-full-width input-title' name="title" ref="title" defaultValue={title} placeholder='Post Title' onChange={updateFn} />
					}
                </h1>
		}
	}
}

export default PostTitle;