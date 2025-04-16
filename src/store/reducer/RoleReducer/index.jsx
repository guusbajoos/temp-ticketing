import { GET_ROLE_LIST, GET_ROLE_BY_ID } from '../../type';

export const roleList = (state = {}, action) => {
  switch (action.type) {
    case GET_ROLE_LIST:
      return action.payload;
    default:
      return state;
  }
};

export const roleById = (state = {}, action) => {
  switch (action.type) {
    case GET_ROLE_BY_ID:
      return action.payload;
    default:
      return state;
  }
};
