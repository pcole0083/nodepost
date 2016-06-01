//library imports
import React from 'react';
import ReactDOM from 'react-dom';
import {markdown} from 'markdown';
import makeLinks from './MakeLinks';
//import only the Link property (Destructoring)

class EditableElement extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.context = context;
        this.state = this.getState(props);
    }

    componentDidMount(){
    	if(this.state_input){
    		this.state_input.focus();
    	}
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        var state = this.getState(nextProps);

        makeLinks(state.html, html => {
            state.html = html;
            this.setState(state);
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.editing){
            ReactDOM.findDOMNode(this.refs.editing).focus();
        }
    }

	getState = props => ({
        locked:  !!props.user && !!props.editor && props.user.username !== props.editor,
        editing: !!props.editing ? true :false,
		content: !!props.content || props.content === '' ? props.content : 'Your text here',
		html: 	 !!props.content ? markdown.toHTML(props.content) : ''
	})

	render() {
		var updateFn  = this.props.update ? this.props.update : null;
		var className = this.props.className ? this.props.className : null;

		var text = this.props.text ? this.props.text : null;
		var name = this.props.name ? this.props.name : null;
		var ref = this.props.ref ? this.props.ref : null;

		var inputType 	= this.props.inputType ? this.props.inputType : 'text';
		var placeholder = this.props.placeholder ? this.props.placeholder : null;

		var content;
		var labelEle;

		var classes = ['u-full-width', 'input-'+name]; //"twelve columns"

		//Text or Input depending on editing state
		if( !!this.props.user && !!this.props.user.username && !!this.state.editing || !!this.props.editable ){
			if(inputType === 'textarea'){
				content = <textarea ref="editing" name={name} placeholder={placeholder} className={ classes.join(' ') } defaultValue={ this.state.content } onChange={updateFn} onBlur={this.save} />
			}
			else {
				content = <input type={inputType} className={ classes.join(' ') } name={name} ref='editing' placeholder={placeholder} defaultValue={ this.state.content } onChange={updateFn} onBlur={this.save} />
			}
		}
		else {
			content = <div className="u-full-width" dangerouslySetInnerHTML={ { __html: this.state.html } } />
		}

		//Input Label
		if(this.state.editing && this.props.label){
			labelEle = <label for={name}>{label}</label>;
		}

		return <div className={className} onClick={this.startEditing} >
				{labelEle}
				{content}
            </div>;
	}
	startEditing = evt => {
		this.toggleEditing(true);
	}
	stopEditing = evt => {
		this.toggleEditing(false, null);
	}
	toggleEditing(editing, input) {
        if(!this.props.user){ //|| !this.props.admin
            return;
        }

        this.setState({
        	editing: editing,
        	editor: this.props.user.username
        });
    }
    save = evt => {
    	this.stopEditing();

    	if(this.props.save){
    		this.props.save(evt);
    	}
    }
}

export default EditableElement;

EditableElement.contextTypes = {
    router: React.PropTypes.func.isRequired
};