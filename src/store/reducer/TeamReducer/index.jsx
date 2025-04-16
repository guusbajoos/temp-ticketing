import { GET_TEAM_BY_ID, GET_TEAM_LIST } from '../../type';

export const teamList = (state = {}, action) => {
  switch (action.type) {
    case GET_TEAM_LIST:
      return action.payload;
    default:
      return state;
  }
};

export const teamById = (state = {}, action) => {
  switch (action.type) {
    case GET_TEAM_BY_ID:
      return action.payload;
    default:
      return state;
  }
};
