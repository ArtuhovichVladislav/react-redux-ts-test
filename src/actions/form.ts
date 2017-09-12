import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const toJSON = createAction<FormState>(Actions.TO_JSON);
export const fromJSON = createAction<FormState>(Actions.FROM_JSON);

