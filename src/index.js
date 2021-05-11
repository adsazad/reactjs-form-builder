import React from 'react';
import { Form, Button } from "react-bootstrap";
import Select from 'react-select';


class FormBuilder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: props.fields,
        };
        console.log(props.fields);
    }
    change(e) {
        console.log(e.target.name);
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
            var errors = [];
            if (value.required == true) {
                if (value.value == null || value.value == "") {
                    hasAnyErr = true;
                    if (value.requireMessage) {
                        errors.push(value.requireMessage);
                    } else {
                        errors.push("Mindatory Field");
                    }
                }
            }
            this.state.fields.fields[key]['errors'] = errors;
        });
        this.props.onChange(this.state.fields);
        if(hasAnyErr == false){
            this.props.onSubmit(this.state.fields);
        }
    }
    componentDidUpdate(nextProps) {
        console.log(nextProps);
        if (nextProps.fields != this.state.fields) {
            this.setState({
                fields: nextProps.fields
            });
        }
    }
    selectChange(name) {
        return function (val) {
            this.state.fields.fields[name]['value'] = val.value;
            this.props.onChange(this.state.fields);
        }.bind(this);
    }
    fieldError(errors) {
        var er = "";
        if (errors != null) {
            er = Object.entries(errors).map(([key,err]) => {
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
                        <Form.Label>{key}</Form.Label>
                        <textarea
                            onChange={this.change.bind(this)}
                            className="form-control"
                            type={value.type}
                            name={key}
                            placeholder={value.placeholder == true && value.label}
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
                            placeholder={value.value}
                            options={value.options}
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
            } else {
                return (
                    <Form.Group>
                        <Form.Label>{value.label}</Form.Label>
                        <Form.Control
                            onChange={this.change.bind(this)}
                            type={value.type}
                            name={key}
                            placeholder={value.placeholder == true && value.label}
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