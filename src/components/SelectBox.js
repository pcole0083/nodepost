import React, { Component } from 'react';

export default class SelectBox extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			valid: '',
			value: props.data.value || props.data.selected || ''
		}
	}
	validateField = (evt) => {
		var isValid = true;

		var input = evt.target,
			val = input.value.trim();

		if(!!this.props.data.optional){
			return this.setState({
				value: val,
				valid: ''
			}, () => {
				if(!!this.props.onUpdateValue){
					this.props.onUpdateValue(val);
				}
			});
		}

		if(val === null || val === undefined){
			isValid = false;
		}

		return this.setState({
			value: val,
			valid: isValid
		}, () => {
			if(!!this.props.onUpdateValue){
				this.props.onUpdateValue(val);
			}
		});
	}
	componentWillReceiveProps(nextProps) {
		let valid = nextProps.data.selected === undefined ? false : true;
		valid = nextProps.data.selected === null ? '' : valid;

		this.setState({
			valid: valid,
			value: nextProps.data.selected
		});
	}
	render() {
		var data = this.props.data;
		var options = data.options;

		var className = 'input-group';

		if(this.state.valid === null || this.state.valid === ''){
			//do nothing to the className
		}
		else if(this.state.valid === true){
			className += ' has-success';
		}
		else if(this.state.valid === false){
			className += ' has-error';
		}

		if(data.placeholder !== null && (options[0].label !== data.placeholder)){
			options.unshift({value: null, label: data.placeholder});
		}

		var optionsHTML = options.map( (option, index) => {
			return <option key={index} value={option.value}>{option.label}</option>
		});

		return (
			<div className={className}>
				<span className="input-group-addon">
					<label htmlFor={data.id} className={data.labelClassName}>{data.labelText}</label>
				</span>
				<select className={data.inputClassName} ref={data.id} id={data.id} value={this.state.value} onChange={this.validateField} onBlur={this.validateField}>
					{optionsHTML}
				</select>
				<i className="glyphicon glyphicon-option-vertical"></i>
			</div>
		);
	}
}

SelectBox.propTypes = {
    data: React.PropTypes.object.isRequired
};
