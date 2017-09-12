import { combineReducers, Reducer } from 'redux';
import form from './form';

export interface RootState {
  form: FormState;
}

export default combineReducers<RootState>({
  form
});
