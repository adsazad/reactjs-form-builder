import React, { useCallback, useState, createRef } from 'react';
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import axios from "axios"

function FormBuilder({ fields, onChange, onSubmit, getActions, rowDef }) {


    // const fchange = useCallback(() => {
    //     // setFieldsS(fields);
    // }, [fields]);

    const initActions = () => {
        var f = fields;
        f.submit = () => { submitCallBack() };
        f.getFormData = () => { return getFormData() };
        if (getActions) {
            getActions(fields);
        }
    }
    React.useEffect(() => {
        initActions();
    }, []);
    const submitCallBack = () => {
        // console.log(fields);
        validate();
    }
    const change = (e) => {
        var f = fields;
        f.fields[e.target.name]['value'] = e.target.value;
        onChange(f);
    }

    const checkBoxChange = (e) => {
        var name = e.target.name;
        var fieldData = fields;
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
        onChange(fieldData);
    }

    const getFormData = () => {
        var formData = new FormData();
        Object.entries(fields.fields).map(([k, v]) => {
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
    const validate = () => {
        var hasAnyErr = false;
        var f = fields;
        Object.entries(fields.fields).map(([key, value]) => {
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
            f.fields[key]['errors'] = errors;
            // setFieldsS(f);
        });
        onChange(f);
        if (hasAnyErr == false) {
            onSubmit(f);
        }
    }
    const submit = (e) => {
        e.preventDefault();
        validate();
    }
    return (
        <Form onSubmit={(e) => { submit(e) }}>
            <Fields masterChange={(f) => { onChange(f) }} rowDef={rowDef} fieldsProps={fields} checkBoxChange={(e) => { checkBoxChange(e) }} change={(c) => {
                change(c);
            }} />
        </Form>
    );
}

function Fields({ fieldsProps, change, checkBoxChange, masterChange, rowDef }) {
    const [fields, setFields] = useState(fieldsProps);
    useEffect(() => {
        setFields(fieldsProps);
    }, [fieldsProps]);

    const requiredFieldStar = (field) => {
        if (field.required) {
            return (<span className="text-danger">*</span>);
        }
        // return (<></>);
    }
    const fieldError = (errors) => {
        var er = "";
        if (errors != null) {
            er = Object.entries(errors).map(([key, err]) => {
                return (<Form.Text className="text-danger">{err}</Form.Text>)
            });
        }
        return er;
    }
    // const selectChange = (name) => {
    //     return function (val) {
    //         console.log(val);

    //     }.bind(this);
    // }
    if (fields.fields) {
        var isRow = false;
        if (rowDef != null) {
            isRow = true;
        }
        var res = Object.entries(fields.fields).map(([key, value]) => {
            fields.fields[key]["actions"] = createRef();
            if (value.type == "textarea") {
                const newLocal =
                    <div key={"field-" + key}>
                        <Form.Group>
                            <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                            <textarea
                                onChange={(e) => { change(e) }}
                                ref={fields.fields[key]["actions"]}
                                className="form-control"
                                type={value.type}
                                name={key}
                                readOnly={value.readOnly == true ? true : false}
                                value={value.value != null ? value.value : ""}
                                placeholder={value.placeholder != null && value.placeholder}
                            ></textarea>
                            {fieldError(value.errors)}
                        </Form.Group>
                    </div>
                    ;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal}</Col>);
                } else {
                    return newLocal;
                }
            } else if (value.type == "select") {
                const newLocal = <div key={"field-" + key}>
                    <Form.Group>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        {fields.fields[key]['url'] ? <AsyncSelect
                            name={key}
                            ref={fields.fields[key]["actions"]}
                            placeholder={value.placeholder != null && value.placeholder}
                            isMulti={value.multiple != null ? value.multiple : false}
                            autoFocus={value.autofocus != null ? value.autofocus : false}
                            // options={value.options}
                            value={value.value != null ? value.value : ""}
                            onChange={(val) => {
                                fields.fields[key]['value'] = val;
                                masterChange(fields);
                            }}
                            className="form-builder-select"
                            cacheOptions
                            defaultOptions
                            loadOptions={async (inputValue) => {
                                var minSearchLen = fields.fields[key]["minSearchLen"] != null ? fields.fields[key]["minSearchLen"] : 2;
                                if (inputValue.length >= minSearchLen) {
                                    var req = await axios.get(`${fields.fields[key]["url"]}?query=${inputValue}`);
                                    return req.data.data;
                                }
                            }} /> : <Select
                            name={key}
                            ref={fields.fields[key]["actions"]}
                            placeholder={value.placeholder != null && value.placeholder}
                            isMulti={value.multiple != null ? value.multiple : false}
                            autoFocus={value.autofocus != null ? value.autofocus : false}
                            options={value.options}
                            value={value.value != null ? value.value : ""}
                            onChange={(val) => {
                                fields.fields[key]['value'] = val;
                                masterChange(fields);
                            }}
                            className="form-builder-select" />}
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal}</Col>);
                } else {
                    return newLocal;
                }
            } else if (value.type == "file") {
                const newLocal_4 = <div key={"field-" + key}>

                    <Form.Group>
                        <Form.File
                            ref={fields.fields[key]["actions"]}
                            label={value.name}
                            name={value.key} />
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal_4}</Col>);
                } else {
                    return newLocal_4;
                }
            } else if (value.type == "submit") {
                // return (<Button type="submit" className={value.color}>{value.label}</Button>);
                var newLocal_5 = <Button type="submit" className={value.color}>{value.label}</Button>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal_5}</Col>);
                } else {
                    return newLocal_5;
                }
            } else if (value.type == "checkbox") {
                const newLocal_3 = <div key={"field-" + key}>
                    <Form.Group ref={fields.fields[key]["actions"]}>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        {Object.entries(value.options).map(([k, v]) => {
                            var ischecked = false;
                            if (value.value != null) {
                                var array = value.value;
                                array = array || [];
                                if (array.includes(v.value)) {
                                    ischecked = true;
                                }
                            }
                            return (<Form.Check type="checkbox" checked={ischecked} name={key} onChange={(e) => { checkBoxChange(e) }} label={v.label} value={v.value} />);
                        })}
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal_3}</Col>);
                } else {
                    return newLocal_3;
                }
            } else if (value.type == "radio") {
                const newLocal_2 = <div key={"field-" + key}>
                    <Form.Group ref={fields.fields[key]["actions"]}>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        {Object.entries(value.options).map(([k, v]) => {
                            var checked = false;
                            if (value != null) {
                                if (value.value == v.value) {
                                    checked = true;
                                }
                            }
                            return (<Form.Check type="radio" name={key} checked={checked} onChange={this.radioChange.bind(this)} label={v.label} value={v.value} />);
                        })}
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal_2}</Col>);
                } else {
                    return newLocal_2;
                }
            } else if (value.type == "number") {
                const newLocal_1 = <div key={"field-" + key}>
                    <Form.Group>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        <InputGroup>
                            {value.prefix && <InputGroup.Text id="basic-addon1">{value.prefix}</InputGroup.Text>}
                            <Form.Control
                                ref={fields.fields[key]["actions"]}
                                onChange={(e) => { change(e) }}
                                readOnly={value.readOnly == true ? true : false}
                                type={value.type}
                                name={key}
                                value={value.value != null ? value.value : ""}
                                placeholder={value.placeholder != null && value.placeholder} />
                            {value.suffix && <InputGroup.Text id="basic-addon1">{value.suffix}</InputGroup.Text>}
                        </InputGroup>
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal_1}</Col>);
                } else {
                    return newLocal_1;
                }
            } else if (value.type == "email") {
                const newLocalEmail = <div key={"field-" + key}>
                    <Form.Group>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        <InputGroup>
                            {value.prefix && <InputGroup.Text id="basic-addon1">{value.prefix}</InputGroup.Text>}
                            <Form.Control
                                ref={fields.fields[key]["actions"]}
                                onChange={(e) => { change(e) }}
                                readOnly={value.readOnly == true ? true : false}
                                type={value.type}
                                name={key}
                                value={value.value != null ? value.value : ""}
                                placeholder={value.placeholder != null && value.placeholder} />
                            {value.suffix && <InputGroup.Text id="basic-addon1">{value.suffix}</InputGroup.Text>}
                        </InputGroup>
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocalEmail}</Col>);
                } else {
                    return newLocalEmail;
                }
            } else {
                const newLocal = <div key={"field-" + key}>
                    <Form.Group>
                        <Form.Label>{value.label} {requiredFieldStar(value)}</Form.Label>
                        <InputGroup>
                            {value.prefix && <InputGroup.Text id="basic-addon1">{value.prefix}</InputGroup.Text>}
                            <Form.Control
                                ref={fields.fields[key]["actions"]}
                                onChange={(e) => { change(e) }}
                                readOnly={value.readOnly == true ? true : false}
                                type={value.type}
                                name={key}
                                value={value.value != null ? value.value : ""}
                                placeholder={value.placeholder != null && value.placeholder} />
                            {value.suffix && <InputGroup.Text id="basic-addon1">{value.suffix}</InputGroup.Text>}
                        </InputGroup>
                        {fieldError(value.errors)}
                    </Form.Group>
                </div>;
                if (isRow) {
                    return (<Col sm={rowDef["sm"]} >{newLocal}</Col>);
                } else {
                    return newLocal;
                }
            }
        });
        if (isRow == true) {
            res = <Row>{res}</Row>;
        }
        return res;
    }
    return <></>;
}
export default FormBuilder;