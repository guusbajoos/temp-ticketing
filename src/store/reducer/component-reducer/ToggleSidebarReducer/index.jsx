import { TOGGLE_SIDEBAR } from '../../../type';

export const isSidebarClose = (state = true, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return action.payload;
    default:
      return state;
  }
};
