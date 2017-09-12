import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: FormState = {
  fieldsContent: '',
  editorText: '',
};

export default handleActions<FormState, FormState>({
  [Actions.TO_JSON]: (state, action) => 
    Object.assign({}, state, {
      fieldsContent: action.payload,
    }),

  [Actions.FROM_JSON]: (state, action) => 
    Object.assign({}, state, {
      editorText: action.payload,
    }),
}, initialState);
