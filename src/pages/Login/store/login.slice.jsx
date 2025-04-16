import { createSlice } from '@reduxjs/toolkit';

import { authAsyncActionLogin } from './login.asyncAction';

const initialState = {
  isAuthenticated: false,
  isAuthReady: false,
  status_LOGIN: 'IDLE',
  error: {
    message: '',
    description: '',
  },
  profile: {},
};

export const loginSlice = createSlice({
  name: 'TICKETING_V2/auth',
  initialState,
  reducers: {
    resetStatus(state, action) {
      state.message = '';
      state.status_LOGIN =
        action.payload === 'RESET' ? 'IDLE' : state.status_LOGIN;
      return state;
    },
    resetErrorMessage(state, action) {
      state.error =
        action.payload === 'RESET'
          ? {
              message: '',
              description: '',
            }
          : state.error;
    },
    resetAll(state) {
      state = initialState;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authAsyncActionLogin.pending, (state) => {
      state.status_LOGIN = 'LOADING';
    });
    builder.addCase(authAsyncActionLogin.fulfilled, (state, { payload }) => {
      state.status_LOGIN = 'SUCCESS';
      state.isAuthenticated = true;
      state.isAuthReady = true;
      state.profile = payload.data;
    });
    builder.addCase(authAsyncActionLogin.rejected, (state, { payload }) => {
      state.status_LOGIN = 'FAILED';
      state.error = {
        message: payload.message,
        description: payload.description,
      };
    });
    // builder.addCase(authAsyncActionCheckAuth.pending, (state) => {
    //   state.status_LOGIN = 'LOADING';
    // });
    // builder.addCase(
    //   authAsyncActionCheckAuth.fulfilled,
    //   (state, { payload }) => {
    //     state.status_LOGIN = 'SUCCESS';
    //     state.isAuthenticated = true;
    //     state.isAuthReady = true;
    //     state.profile = payload;
    //   }
    // );
    // builder.addCase(authAsyncActionCheckAuth.rejected, (state, { payload }) => {
    //   state.status_LOGIN = 'FAILED';
    //   state.isAuthenticated = false;
    //   state.isAuthReady = true;
    //   state.error = {
    //     message: payload.message,
    //     description: payload.description,
    //   };
    // });
    // builder.addCase(authSharedAsyncActionUnauthorized.fulfilled, (state) => {
    //   state = { ...initialState };
    //   state.isAuthReady = true;
    //   return state;
    // });
    return builder;
  },
});
