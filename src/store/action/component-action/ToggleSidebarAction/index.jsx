import { TOGGLE_SIDEBAR } from '../../../type';

export const toggleSidebar = (isOpen) => async (dispatch) => {
  dispatch({
    type: TOGGLE_SIDEBAR,
    payload: isOpen,
  });
};
