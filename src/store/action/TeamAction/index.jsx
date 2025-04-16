import TeamApi from 'api/team';

import { GET_TEAM_BY_ID, GET_TEAM_LIST } from '../../type';

export const getTeamList = (param) => async (dispatch) => {
  const { data } = await TeamApi.getTeamList(param);

  dispatch({
    type: GET_TEAM_LIST,
    payload: data,
  });
};

export const getTeamById = (id) => async (dispatch) => {
  const { data } = await TeamApi.getTeamById(id);

  dispatch({
    type: GET_TEAM_BY_ID,
    payload: data,
  });
};
