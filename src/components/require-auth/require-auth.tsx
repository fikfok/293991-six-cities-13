import { Navigate, Outlet } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';

function RequireAuth(): JSX.Element {
  const authorizationStatus = AuthorizationStatus.NoAuth;
  return authorizationStatus === AuthorizationStatus.Auth ? <Outlet/> : <Navigate to={AppRoute.Login}/>;
}

export default RequireAuth;