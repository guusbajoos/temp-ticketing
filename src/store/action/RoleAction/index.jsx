import RoleApi from 'api/role';

import { GET_ROLE_LIST, GET_ROLE_BY_ID } from '../../type';

export const getRoleList = (param) => async (dispatch) => {
  const { data } = await RoleApi.getRoleList(param);

  dispatch({
    type: GET_ROLE_LIST,
    payload: data,
  });
};

export const getRoleById = (id) => async (dispatch) => {
  const { data } = await RoleApi.getRoleById(id);

  dispatch({
    type: GET_ROLE_BY_ID,
    payload: data,
  });
};
