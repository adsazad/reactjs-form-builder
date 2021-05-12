# reactjs-form-builder

> React Js Form Builder

[![NPM](https://img.shields.io/npm/v/reactjs-form-builder.svg)](https://www.npmjs.com/package/reactjs-form-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save reactjs-form-builder
```
|Field Types|   |Attributes   |
|-----------|---|-------------|
| Text      | type: text  | placeholder: true/false,<br />required: true/false,<br />requireMessage: "Custom message for require"            |
| Textarea  | type: textarea| placeholder: true/false,<br />required: true/false,<br />requireMessage: "Custom message for require" |
| Select    | type: select | placeholder:true/false,<br />options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require", <br />multiple: true/false, autofocus: true/false |
| Checkbox  | type: checkbox| placeholder:true/false,<br /> options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require"|
| Radio     | type: radio| placeholder:true/false,<br /> options:[{"label":"Apple","value":"apple"},{"label":"Banana","value":"banana"}] ,<br />required: true/false,<br />requireMessage: "Custom message for require"|
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
            "placeholder": true,
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
              "placeholder": true,
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
    var description = this.state.form.value;
    var category = this.state.form.value; // returns value from the options
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

## License

MIT © [adsazad](https://github.com/adsazad)
