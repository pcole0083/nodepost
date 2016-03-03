//library imports
import React from 'react';
import ReactDOM from 'react-dom';
import ListItemWrapper from './ListItemWrapper';
import * as API from '../api';

class Tags extends React.Component {

	state = {
		tags: {},
		loaded: false
	}

	constructor(props, context) {
        super(props, context);
        this.context = context;
    }

    componentDidMount() {
    	API.tags.on('value', ss => this.setState({
    		tags: ss.exportVal() || {},
    		loaded: true
    	}));
    }

    addNew = evt => {
    	let input = ReactDOM.findDOMNode(this.refs.newInput);
    	if(!!input && !!input.value){
    		//add check to see if tag already exists
    		API.tags.push(input.value);
    	}
    };

    deleteTag = evt => {
    	let target = evt.target;
    	let tagId = target.getAttribute('data-id');
    	console.log(tagId);
    }

	render() {
		let self =   this;
		let data =   this.props.data;
		let editor = !!this.props.editor ? this.props.editor : null;
		let tags =   !!editor && !!this.state.tags ? this.state.tags : {};

        let list = '';
        let addNew = '';

        if(!!editor) {
        	list = <ul className="tags" >
                {Object.keys(data).map(function(id) {
                	return <li className="tag" key={id} >
                		<button className="toggle-btn button selected">{data[id]}</button>
                		<span className="remove" key={id} data-id={id} onClick={self.deleteTag} >x</span>
        			</li>;
                })}
                {Object.keys(tags).map(function(id) {
                	return <li className="tag" key={id} >
                		<button className="toggle-btn button">{tags[id]}</button>
                		<span className="remove" key={id} data-id={id} onClick={self.deleteTag} >x</span>
        			</li>;
                })}
            </ul>;

        	addNew = <div className="add-new">
        		<input type="text" className="new-tag-input" ref="newInput" />
        		<button className="button add-new-button" onClick={this.addNew}>Add</button>
        	</div>;
        }
        else {
        	list = <ul className="tags" >
                {Object.keys(data).map(function(id) {
                	return <li className="tag" key={id} >{data[id]}</li>;
                })}
            </ul>;
        }

        return <div>
        	{list}
        	{addNew}
        </div>;
	}
}

export default Tags;