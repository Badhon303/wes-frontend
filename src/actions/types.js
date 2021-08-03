import { createActionTypes } from '../utils'

export const ITEM = createActionTypes('ITEM', [
  'GET',
  'GET_ONE',
  'SAVE',
  'PUT',
  'PATCH',
  'DELETE',
  'SUCCESS',
  'FAILURE',
])

export const AUTH = createActionTypes('AUTH', [
  'SET_USER',
  'SET_TOKEN',
  'FORGET_TOKEN',
  'GET_TOKEN',
  'GET_USER',
  'FORGET_USER',
])

export default ITEM
