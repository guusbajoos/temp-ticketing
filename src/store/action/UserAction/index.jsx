import UserApi from 'api/user';
import { get } from 'lodash';

import { GET_USER_BY_ID, GET_USER_LIST } from '../../type';

export const getUserList = (param) => async (dispatch) => {
  const { data } = await UserApi.getUserList(param);

  dispatch({
    type: GET_USER_LIST,
    payload: data,
  });
};

export const getUserById = (id) => async (dispatch) => {
  const { data } = await UserApi.getUserById(id);
  const teamId = get(data.roles[0].teams[0], 'id', '');
  localStorage.setItem('team_id', teamId);

  dispatch({
    type: GET_USER_BY_ID,
    payload: data,
  });
};
