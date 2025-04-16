import {GET_USER_LIST, GET_USER_BY_ID} from '../../type';

export const userList = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_LIST:
      return action.payload;
    default:
      return state;
  }
};

export const userById = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_BY_ID:
      return action.payload;
    default:
      return state;
  }
};
