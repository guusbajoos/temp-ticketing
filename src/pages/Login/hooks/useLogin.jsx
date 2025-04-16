import { useDispatch, useSelector } from 'react-redux';
import { authAsyncActionLogin } from '../store/login.asyncAction';

import { loginSlice } from '../store/login.slice';

// import { useReduxDispatch } from '@shared/hooks/useReduxDispatch/useReduxDispatch';
// import { useReduxSelector } from '@shared/hooks/useReduxSelector/useReduxSelector';

export const useLogin = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state['login']);

  const resetAll = () => {
    dispatch(loginSlice.actions.resetAll());
  };

  const resetError = (param) => {
    dispatch(loginSlice.actions.resetErrorMessage(param));
  };

  const resetStatus = (param) => {
    dispatch(loginSlice.actions.resetStatus(param));
  };

  const login = (payload) => {
    dispatch(authAsyncActionLogin(payload));
  };

  return {
    state,
    resetError,
    resetStatus,
    resetAll,
    login,
  };
};
