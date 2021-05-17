import React from 'react';
import { Form, Button } from "react-bootstrap";
import Select from 'react-select';


class FormBuilder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: props.fields,
        };
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
                console.log(value.value)
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
            console.log(errors);

            if (errors) {
                if (errors.length != 0) {
                    hasAnyErr = true;
                }
            }
            console.log(hasAnyErr);
            this.state.fields.fields[key]['errors'] = errors;
        });
        this.props.onChange(this.state.fields);
        if (hasAnyErr == false) {
            this.props.onSubmit(this.state.fields);
        }
    }
    componentDidUpdate(nextProps) {
        if (nextProps.fields != this.state.fields) {
            this.setState({
                fields: nextProps.fields
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
    getFields() {
        const res = Object.entries(this.state.fields.fields).map(([key, value]) => {
            if (value.type == "textarea") {
                return (
                    <Form.Group>
                        <Form.Label>{value.label}</Form.Label>
                        <textarea
                            onChange={this.change.bind(this)}
                            className="form-control"
                            type={value.type}
                            name={key}
                            readOnly={value.readOnly == true ? true : false}
                            defaultValue={value.value != null ? value.value : ""}
                            placeholder={value.placeholder != null && value.placeholder}
                        ></textarea>
                        {this.fieldError(value.errors)}
                    </Form.Group>
                );
            } else if (value.type == "select") {
                return (
                    <Form.Group>
                        <Form.Label>{value.label}</Form.Label>
                        <Select
                            name={key}
                            // placeholder={value.value}
                            isMulti={value.multiple != null ? value.multiple : false}
                            autoFocus={value.autofocus != null ? value.autofocus : false}
                            options={value.options}
                            value={value.value != null ? value.value : ""}
                            onChange={this.selectChange(key)}
                        />
                        {this.fieldError(value.errors)}

                    </Form.Group>
                );
            } else if (value.type == "file") {
                return (
                    <Form.Group>
                        <Form.File
                            label={value.name}
                            name={value.key}
                        />
                        {this.fieldError(value.errors)}
                    </Form.Group>
                );
            } else if (value.type == "submit") {
                return (<Button type="submit" className={value.color}>{value.label}</Button>);
            } else if (value.type == "checkbox") {
                return (
                    <Form.Group >
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
                );
            } else if (value.type == "radio") {
                return (
                    <Form.Group >
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
                );
            } else {
                return (
                    <Form.Group>
                        <Form.Label>{value.label}</Form.Label>
                        <Form.Control
                            onChange={this.change.bind(this)}
                            readOnly={value.readOnly == true ? true : false}
                            type={value.type}
                            name={key}
                            defaultValue={value.value != null ? value.value : ""}
                            placeholder={value.placeholder != null && value.placeholder}
                        />
                        {this.fieldError(value.errors)}
                    </Form.Group>
                );
            }
        });
        return res;
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