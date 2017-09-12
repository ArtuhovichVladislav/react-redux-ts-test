import * as React from 'react';

import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';

import AceEditor from 'react-ace';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import Forward from 'material-ui/svg-icons/content/forward';
import { isEqual, omit, has } from 'lodash';

import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

const style = require('./style.css');

export namespace Form {
   export interface Props {
    form: FormState;
    toJSON: (string) => any;
    fromJSON: (string) => any;
  }

  interface Fields {
    fullName: string;
    email: string;
    sex: string;
    militaryDuty?: any;
  }

  export interface State {
    fields: Fields;
    editorText: string;
    completed: number;
    isEmailValid: boolean;
  }
}

export class Form extends React.Component<Form.Props, Form.State> {

  constructor(props?: Form.Props, context?: any) {
    super(props, context);

    this.state = {
      fields: {
        fullName: '',
        email: '',
        sex: '',
        militaryDuty: null,
      },
      editorText: '',
      completed: 0,
      isEmailValid: false,
    };

    this.handleToJSON = this.handleToJSON.bind(this);
    this.handleFromJSON = this.handleFromJSON.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.getFields = this.getFields.bind(this);
    this.getValidFieldsCount = this.getValidFieldsCount.bind(this);
    this.checkIfObjectIsValid = this.checkIfObjectIsValid.bind(this);
  }

  componentWillMount() {
    this.setState({
      editorText: JSON.stringify(this.getFields(), null, 1)
    })
  }

  componentWillReceiveProps(newProps) {
    if(!isEqual(this.props.form.fieldsContent, newProps.form.fieldsContent)) {
      this.setState({
        editorText: newProps.form.fieldsContent
      });
    }

    if(!isEqual(this.props.form.editorText, newProps.form.editorText)) {
      const obj = JSON.parse(newProps.form.editorText);

      this.setState({
        fields: obj,
      });
    }
  }

  checkIfObjectIsValid(obj) {
    const maleFields = ['fullName', 'email','sex','militaryDuty'];
    const femaleFields = ['fullName', 'email','sex'];
    let isValid = true;

    if(this.state.fields.sex === 'male') {
      maleFields.forEach((key, index) => {
        if(!has(obj, key) ||
            (typeof obj[key] !== 'string' && index !== (maleFields.length - 1)) ||
            (typeof obj[key] !== 'boolean' && index === (maleFields.length - 1))
        ) {
            isValid = false;
        }
      })
    } else {
      femaleFields.forEach(key => {
        if(!has(obj, key) || typeof obj[key] !== 'string') {
          isValid = false;
        }
      });
    }

    return isValid;
  }

  getValidFieldsCount() {
    let count = 0;
    const fields = this.state.fields;

    Object.keys(fields).forEach(key => {
      if(fields[key] !== null && fields[key] !== '')
        count++;
    });

    return count;
  }

  getFields() {
    const isMale = this.state.fields.sex === 'male';
    return isMale ? this.state.fields : omit(this.state.fields, 'militaryDuty');
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value
      }
    });
    if(name === 'email') {
      
    }
  }

  handleCheckboxChange() {
    this.setState({
      fields: {
        ...this.state.fields,
        militaryDuty: !this.state.fields.militaryDuty
      }
    });
  }

  handleRadioChange(event: any) {
    this.setState({
      fields: {
        ...this.state.fields,
        sex: event.target.value
      },
    });
  }

  handleToJSON() {
    this.props.toJSON(JSON.stringify(this.getFields(), null, 1));
  }

  handleFromJSON() {
    try {
      const obj = JSON.parse(this.state.editorText);

      if(this.checkIfObjectIsValid(obj)) {
        this.props.fromJSON(this.state.editorText);
      }
      else {
        alert("JSON must be valid and contain fields:\n fullName,\n email,\n sex,\n militaryDuty (optional)");
      }
    } catch (e) {
      alert("JSON must be valid and contain fields:\n fullName,\n email,\n sex,\n militaryDuty (optional)");
    }
  }

  handleEditorChange(value: string) {
    this.setState({
      editorText: value
    })
  }

  public render() {
    const { fields } = this.state;
    const { fullName, email, sex, militaryDuty } = fields;

    const all = Object.keys(this.getFields()).length;
    const completed = this.getValidFieldsCount() || 0;

    return (
      <div className={style.Form}>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleToJSON}
          className={style.Form__form}
          onError={errors => console.log(errors)}
        >
          <div className={style.Form__fields}>
            <h2>Completed: {completed}/{all}</h2>
            <TextValidator
              floatingLabelText="Full name"
              name='fullName'
              value={fullName}
              onChange={this.handleChange}
              validators={['required']}
              maxLength={50}
            />
            <TextValidator
              floatingLabelText="Email"
              onChange={this.handleChange}
              name="email"
              value={email}
              validators={['required', 'isEmail']}
              errorMessages={['this field is required', 'email is not valid']}
            />
            <h2>Sex:</h2>

            <RadioButtonGroup
              name="sex"
              onChange={this.handleRadioChange}
              valueSelected={sex}
            >
              <RadioButton
                value="male"
                label="Male"
              />
              <RadioButton
                value="female"
                label="Female"
              />
            </RadioButtonGroup>
            {sex === 'male' && ( 
              <Checkbox
                label="Military duty"
                checked={militaryDuty}
                onCheck={this.handleCheckboxChange}
              />
            )}
          </div>
          <div className={style.Buttons}>

            <div className={style.Buttons__button}>
              <FloatingActionButton type='submit'>
                <Forward />
              </FloatingActionButton>
            </div>

            <div className={style.Buttons__button}>
              <FloatingActionButton onClick={this.handleFromJSON}>
                <Forward />
              </FloatingActionButton>
            </div>
          
          </div>
        </ValidatorForm>
        <AceEditor
          className={style.Editor}
          mode="javascript"
          theme="tomorrow"
          name="editor"
          fontSize={20}
          showGutter={false}
          tabSize={2}
          editorProps={{$blockScrolling: true}}
          value={this.state.editorText}
          onChange={this.handleEditorChange}
        />
      </div>
    );
  }
}
