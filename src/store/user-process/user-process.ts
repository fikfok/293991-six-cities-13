import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, AuthorizationStatus } from '../../const';
import { UserProcess } from '../../types/state';
import { checkAuthAction, loginAction, logoutAction } from '../../services/api-actions';
import { saveToken } from '../../services/token';

const initialState: UserProcess = {
  authorizationStatus: AuthorizationStatus.Unknown,
  userEmail: ''
};

export const userProcess = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    saveAuthorization: (state, action) => {
      state.authorizationStatus = action.payload;
    },
    changeUserEmail: (state, action) => {
      state.userEmail = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(checkAuthAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userEmail = action.payload.email;
      })
      .addCase(checkAuthAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userEmail = '';
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.authorizationStatus = AuthorizationStatus.Auth;
        state.userEmail = action.payload.email;
      })
      .addCase(loginAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userEmail = '';
      })
      .addCase(logoutAction.pending, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userEmail = '';
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userEmail = '';
      })
      .addCase(logoutAction.rejected, (state) => {
        state.authorizationStatus = AuthorizationStatus.NoAuth;
        state.userEmail = '';
      })
  }
});

export const {saveAuthorization, changeUserEmail} = userProcess.actions;