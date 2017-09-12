import * as React from 'react';
import * as FormActions from '../../actions/form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { RootState } from '../../reducers';
import { Form } from '../../components';

export namespace App {
  export interface Props extends RouteComponentProps<void> {
    actions: typeof FormActions;
    form: FormState;
  }

  export interface State {
    /* empty */
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class App extends React.Component<App.Props, App.State> {

  render() {
    const { form, actions, children } = this.props;
    return (
      <div>
        <Form
          form={form} 
          toJSON={actions.toJSON}
          fromJSON={actions.fromJSON} />
        {children}
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    form: state.form,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(FormActions as any, dispatch)
  };
}
