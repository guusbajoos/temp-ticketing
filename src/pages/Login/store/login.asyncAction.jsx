import { createAsyncThunk } from '@reduxjs/toolkit';

import authApi from 'datasource/auth.datasource';

export const authAsyncActionLogin = createAsyncThunk(
  'TICKETING_V2/auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.Login(payload);
      const NOTIF_1DAY = true;
      if (data) {
        localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('user_name', data.user.name);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('notification_unassigned', NOTIF_1DAY);
        window.location.href = '/dashboard';
        window.location.reload();
      }
    } catch (error) {
      return rejectWithValue(JSON.parse(JSON.stringify(error)));
    }
  }
);
