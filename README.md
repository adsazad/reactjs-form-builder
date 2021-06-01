# reactjs-form-builder

> React Js Form Builder

[![NPM](https://img.shields.io/npm/v/reactjs-form-builder.svg)](https://www.npmjs.com/package/reactjs-form-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save reactjs-form-builder
```
|Field Types|   |Attributes   |
|-----------|---|-------------|
| Text      | type: text  |readOnly: true/false,<br/> placeholder: String,<br />required: true/false,<br />requireMessage: "Custom message for require",<br />min: Integer, <br/>max: Integer            |
| Number      | type: number  |readOnly: true/false,<br/> placeholder: String,<br />required: true/false,<br />requireMessage: "Custom message for require",<br />min: Integer, <br/>max: Integer            |
| Textarea  | type: textarea|readOnly: true/false,<br/> placeholder: String,<br />required: true/false,<br />requireMessage: "Custom message for require",<br />min: Integer, <br/>max: Integer |
| Select    | type: select | placeholder: String,<br />options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require", <br />multiple: true/false,<br /> autofocus: true/false |
| Checkbox  | type: checkbox| placeholder:String,<br /> options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require"|
| Radio     | type: radio| placeholder:String,<br /> options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require"|
## Usage

```jsx
import React, { Component } from 'react'

import FormBuilder from 'reactjs-form-builder'

class Example extends Component {
  constructor(props) {
    super(props);
    this.setState({
      form:{
        "fields":{
          "name":{
            'label': "Product Name",
            "type": "text",
            "placeholder": "Custom Placeholder",
            "required": true,
            "requireMessage": "This Field is Required" // To customize message if field is empty
          },
          "description":{
            'label': "Product Name",
            "type": "textarea",
            "required": true,
          },
          "categories": {
             'label': "Categories",
              "type": "select",
              'options': [
                {'label':"Apple", 'value':1},
                {'label':"Banana", 'value':2}
              ],
              "placeholder": "Custom Placeholder",
              "required": true,
              "requireMessage": "This Field is Required"
         },
         'submit': {
            "type": "submit",
            "label": "Create Product",
            'color:': 'btn-primary',
          }
        }
      }
    });
  }
  onChange(data){
    this.setState({
      form: data
    });
  }
  onSubmit(data){
    this.setState({
      form: data
    });
    var name = this.state.form.name.value;
    var description = this.state.form.description.value;
    var category = this.state.form.category.value; 
  }
  render() {
    return <FormBuilder
      fields={this.state.form}
      onChange={this.onChange.bind(this)}
      onSubmit={this.onSubmit.bind(this)}
    />
  }
}
```
## Actions
if you preform action like focusing onto field on component mount or other actions on field reference. add `getAction` prop in your FormBuilder Component.
```jsx
getActions(data){
  this.setState({
    form: data,
  });
}
render(){
  return (
  <FormBuilder
  fields={this.state.form}
  getActions={this.getActions.bind(this)}
  />
  );
}
```
getAction prop gives callback and return form state with actions.
once getAction is initiated you will have `actions` key in your field.

Eg. to focus in field.
```jsx
this.state.form.fields.yourtextfield.actions.focus();
```

## License

MIT © [adsazad](https://github.com/adsazad)
