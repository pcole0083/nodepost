//library imports
import React from 'react';
import ReactDOM from 'react-dom';
//import only the Link property (Destructoring)
import * as API from '../api';
import ListItemWrapper from './ListItemWrapper';

export default class SettingsListItem extends ListItemWrapper {
	state = {
		setting: null,
		type: null,
		label: null,
		value: null,
		id: null,
		className: 'list-item'
	}

	constructor(props, context) {
        super(props, context);
        this.context = context;
    }

	componentDidMount() {
		this.updateState(this.props);
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
        this.updateState(nextProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
    	console.log('Should update?');
    	if(!this.state.id){
    		return true;
    	}

        var input = ReactDOM.findDOMNode(this.refs[this.state.id]);
        if(input.type !== 'checkbox' && (input.value === nextState.value) ){
        	return false;
        }

        return true;
    }

    updateState = (props) => {
    	this.setState({
			setting: props.setting || this.state.setting,
			type: props.setting.type || this.state.type,
			label: props.setting.label || this.state.label,
			value: props.setting.value || this.state.value,
			id: props.id || this.state.id,
			className: props.className || this.state.className
		});
    }

	render() {
		var setting = this.state.setting;
		var id = this.state.id;
		var className = this.state.className;

		var checked = (!!setting && setting.type === 'checkbox') ? setting.value : '';

		if(!!setting && !!id){
			return setting.type === 'select-one' ? 
            	<li key={id} className={className}><label htmlFor={id}><span className="setting-label">{setting.label}</span><select key={id} name={id} ref={id} data-lbl={setting.label} defaultValue={setting.value[0]} onChange={this.updateSetting} >{this.renderOptions(setting)}</select></label></li>
            	:
            	<li key={id} className={className}><label htmlFor={id}><span className="setting-label">{setting.label}</span><input key={id} name={id} ref={id} data-lbl={setting.label} type={setting.type} defaultValue={setting.value} onChange={this.updateSetting} checked={checked} /></label></li>
			;
		}
		return null;
	}

	renderOptions(setting) {
        if(!setting || setting.type !== 'select-one'){
            return null;
        }

        return setting.value.map((val, id) =>
            <option key={id} value={setting.value[id].value} >{setting.value[id].label}</option>
        );
    };

    updateSetting = evt => {
        var ele = evt.target;
        var name = ele.name,
            type = ele.type,
            updatedVal = ele.value;

        if(type === 'checkbox'){
        	updatedVal = ele.checked ? 'checked' : '';
        }

        var updatedSetting = Object.assign(this.state.setting, {type: type, label: ele.getAttribute('data-lbl'), value: updatedVal});

        this.updateState({
        	setting: updatedSetting,
			type: updatedSetting.type,
			label: updatedSetting.label,
			value: updatedSetting.value,
			id: this.state.id,
			className: this.state.className
        });
        API.settings.child(name).set(updatedSetting);
    }
}