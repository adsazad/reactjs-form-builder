import React from 'react';
import { Form, Button, InputGroup } from "react-bootstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';


class FormBuilder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: props.fields,
        };
    }
    componentDidMount() {
        this.initActions();
    }
    change(e) {
        this.state.fields.fields[e.target.name]['value'] = e.target.value;
        this.props.onChange(this.state.fields);
    }
    submit(e) {
        e.preventDefault();
        this.validate();
    }
    validate() {
        var hasAnyErr = false;
        Object.entries(this.state.fields.fields).map(([key, value]) => {
            if (value.errors != null) {
                var errors = value.errors;
            } else {
                var errors = [];
            }
            if (value.min != null) {
                var minMessage = "Field must have minimum " + value.min + " characters";
                if (value.value != null) {
                    if (value.value.length != 0) {
                        if (value.value.length < value.min) {
                            hasAnyErr = true;
                            if (errors.indexOf() == -1) {
                                errors.push(minMessage);
                            }
                        } else {
                            if (errors.indexOf(minMessage) > -1) {
                                errors.splice(errors.indexOf(minMessage), 1);
                            }
                        }
                    } else {
                        if (errors.indexOf(minMessage) > -1) {
                            errors.splice(errors.indexOf(minMessage), 1);
                        }
                    }
                }
            }
            if (value.max != null) {
                var maxMessage = "Field must have maximum " + value.max + " characters only";
                if (value.value != null) {
                    if (value.value.length > value.max) {
                        hasAnyErr = true;
                        if (errors.indexOf() == -1) {
                            errors.push(maxMessage);
                        }
                    } else {
                        if (errors.indexOf(maxMessage) > -1) {
                            errors.splice(errors.indexOf(maxMessage), 1);
                        }
                    }
                }
            }
            if (value.required == true) {
                if (value.requireMessage) {
                    var requiredMessage = value.requireMessage;
                } else {
                    var requiredMessage = "Mindatory Field";
                }
                if (value.value == null || value.value == "") {
                    hasAnyErr = true;
                    if (errors.indexOf(requiredMessage) == -1) {
                        errors.push(requiredMessage);
                    }
                } else {
                    if (errors != null) {
                        var erindex = errors.indexOf(requiredMessage);
                        if (erindex > -1) {
                            errors.splice(erindex, 1);
                        }
                    }
                }
            }
            if (errors) {
                if (errors.length != 0) {
                    hasAnyErr = true;
                }
            }
            this.state.fields.fields[key]['errors'] = errors;
        });
        this.props.onChange(this.state.fields);
        if (hasAnyErr == false) {
            this.props.onSubmit(this.state.fields);
        }
    }
    componentDidUpdate(previousProps) {
        if (this.props.fields != this.state.fields) {
            this.setState({
                fields: this.props.fields
            });
        }
    }
    selectChange(name) {
        return function (val) {
            this.state.fields.fields[name]['value'] = val;
            this.props.onChange(this.state.fields);
        }.bind(this);
    }
    radioChange(e) {
        var name = e.target.name;
        var fieldData = this.state.fields;
        fieldData.fields[name]["value"] = e.target.value;
        this.setState({
            fields: fieldData,
        });
        this.props.onChange(this.state.fields);
    }
    checkBoxChange(e) {
        var name = e.target.name;
        var fieldData = this.state.fields;
        var array = new Array();
        array = array || [];
        if (fieldData.fields[name]['value'] != null) {
            array = fieldData.fields[name]["value"];
            array = array || [];
        }
        if (e.target.checked) {
            array.push(e.target.value);
        } else {
            array.splice(array.indexOf(e.target.value), 1);
        }
        fieldData.fields[name]["value"] = array;
        this.setState({
            fields: fieldData,
        });
        this.props.onChange(this.state.fields);
    }
    fieldError(errors) {
        var er = "";
        if (errors != null) {
            er = Object.entries(errors).map(([key, err]) => {
                return (<Form.Text className="text-danger">{err}</Form.Text>)
            });
        }
        return er;
    }
    submitCallBack() {
        this.validate();
    }
    initActions() {
        // console.log(this.state.fields);
        this.state.fields.submit = this.submitCallBack.bind(this);
        this.state.fields.getFormData = this.getFormData.bind(this);
        if (this.props.getActions) {
            this.props.getActions(this.state.fields);
        }
    }
    requiredFieldStar(field) {
        if (field.required) {
            return (<span className="text-danger">*</span>);
        }
        // return (<></>);
    }
    getFields() {
        const res = Object.entries(this.state.fields.fields).map(([key, value]) => {
            this.state.fields.fields[key]["actions"] = React.createRef();
            if (value.type == "textarea") {
                return (
                    <div key={"field-" + key}>
                        <Form.Group>
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            <textarea
                                onChange={this.change.bind(this)}
                                ref={this.state.fields.fields[key]["actions"]}
                                className="form-control"
                                type={value.type}
                                name={key}
                                readOnly={value.readOnly == true ? true : false}
                                value={value.value != null ? value.value : ""}
                                placeholder={value.placeholder != null && value.placeholder}
                            ></textarea>
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            } else if (value.type == "select") {
                return (
                    <div key={"field-" + key}>
                        <Form.Group>
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            {this.state.fields.fields[key]['url'] ? <Select
                                name={key}
                                ref={this.state.fields.fields[key]["actions"]}
                                placeholder={value.placeholder != null && value.placeholder}
                                isMulti={value.multiple != null ? value.multiple : false}
                                autoFocus={value.autofocus != null ? value.autofocus : false}
                                options={value.options}
                                value={value.value != null ? value.value : ""}
                                onChange={this.selectChange(key)}
                                className="form-builder-select"
                            /> :
                                <AsyncSelect
                                    name={key}
                                    ref={this.state.fields.fields[key]["actions"]}
                                    placeholder={value.placeholder != null && value.placeholder}
                                    isMulti={value.multiple != null ? value.multiple : false}
                                    autoFocus={value.autofocus != null ? value.autofocus : false}
                                    // options={value.options}
                                    value={value.value != null ? value.value : ""}
                                    onChange={this.selectChange(key)}
                                    className="form-builder-select"
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={async (inputValue) => {
                                        var req = await axios.get(`${this.state.fields.fields[key]["url"]}?query=${inputValue}`);
                                        return req.data.data;
                                    }}
                                />
                            }
                            {this.fieldError(value.errors)}

                        </Form.Group>
                    </div>
                );
            } else if (value.type == "file") {
                return (
                    <div key={"field-" + key}>

                        <Form.Group>
                            <Form.File
                                ref={this.state.fields.fields[key]["actions"]}
                                label={value.name}
                                name={value.key}
                            />
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            } else if (value.type == "submit") {
                return (<Button type="submit" className={value.color}>{value.label}</Button>);
            } else if (value.type == "checkbox") {
                return (
                    <div key={"field-" + key}>
                        <Form.Group ref={this.state.fields.fields[key]["actions"]} >
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            {
                                Object.entries(value.options).map(([k, v]) => {
                                    var ischecked = false;
                                    if (value.value != null) {
                                        var array = value.value;
                                        array = array || [];
                                        if (array.includes(v.value)) {
                                            ischecked = true;
                                        }
                                    }
                                    return (<Form.Check type="checkbox" checked={ischecked} name={key} onChange={this.checkBoxChange.bind(this)} label={v.label} value={v.value} />);
                                })
                            }
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            } else if (value.type == "radio") {
                return (
                    <div key={"field-" + key}>
                        <Form.Group ref={this.state.fields.fields[key]["actions"]} >
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            {
                                Object.entries(value.options).map(([k, v]) => {
                                    var checked = false;
                                    if (value != null) {
                                        if (value.value == v.value) {
                                            checked = true;
                                        }
                                    }
                                    return (<Form.Check type="radio" name={key} checked={checked} onChange={this.radioChange.bind(this)} label={v.label} value={v.value} />);
                                })
                            }
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            } else if (value.type == "number") {
                return (
                    <div key={"field-" + key}>
                        <Form.Group>
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            <InputGroup>
                                {value.prefix && <InputGroup.Text id="basic-addon1">{value.prefix}</InputGroup.Text>}
                                <Form.Control
                                    ref={this.state.fields.fields[key]["actions"]}
                                    onChange={this.change.bind(this)}
                                    readOnly={value.readOnly == true ? true : false}
                                    type={value.type}
                                    name={key}
                                    value={value.value != null ? value.value : ""}
                                    placeholder={value.placeholder != null && value.placeholder}
                                />
                                {value.suffix && <InputGroup.Text id="basic-addon1">{value.suffix}</InputGroup.Text>}
                            </InputGroup>
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            } else {
                return (
                    <div key={"field-" + key}>
                        <Form.Group>
                            <Form.Label>{value.label} {this.requiredFieldStar(value)}</Form.Label>
                            <InputGroup>
                                {value.prefix && <InputGroup.Text id="basic-addon1">{value.prefix}</InputGroup.Text>}
                                <Form.Control
                                    ref={this.state.fields.fields[key]["actions"]}
                                    onChange={this.change.bind(this)}
                                    readOnly={value.readOnly == true ? true : false}
                                    type={value.type}
                                    name={key}
                                    value={value.value != null ? value.value : ""}
                                    placeholder={value.placeholder != null && value.placeholder}
                                />
                                {value.suffix && <InputGroup.Text id="basic-addon1">{value.suffix}</InputGroup.Text>}
                            </InputGroup>
                            {this.fieldError(value.errors)}
                        </Form.Group>
                    </div>
                );
            }
        });
        return res;
    }
    getFormData() {
        var formData = new FormData();
        Object.entries(this.state.fields.fields).map(([k, v]) => {
            if (v.required == true) {
                if (v.type == "select" || v.type == "checkbox" || v.type == "radio") {
                    formData.append(k, v.value.value);
                } else {
                    formData.append(k, v.value);
                }
            } else {
                if (v.value) {
                    if (v.type == "select" || v.type == "checkbox" || v.type == "radio") {
                        formData.append(k, v.value.value);
                    } else {
                        formData.append(k, v.value);
                    }
                }
            }
        });
        return formData;
    }
    render() {
        const res = this.getFields();
        return (
            <Form onSubmit={this.submit.bind(this)}>
                {res}
            </Form>
        );
    }

}

export default FormBuilder;