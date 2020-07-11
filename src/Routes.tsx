import React, { lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import GithubLogin from './GithubLogin';
import Logout from './components/Logout';
import Error500Page from './components/500';
import Error404Page from './components/404';
const Explore = lazy(() => import('./components/Explore'));
const Profile = lazy(() => import('./components/Profile'));
const Home = lazy(() => import('./components/Home'));

type PrivateRouteType = (component: any, path: string) => any;

const isAuthenticated = () => {
  let data: string | null = localStorage.getItem('user');

  return data ? JSON.parse(data) : null;
};

const PrivateRoute: PrivateRouteType = ({ component: Component, path }) => {
  const userInfo = isAuthenticated();
  const isAuth = Boolean(userInfo);

  return (
    <Route
      render={(props) =>
        isAuth ? (
          <Component user={userInfo} {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

const Routes = () => (
  <React.Suspense fallback={() => <div>Loading...</div>}>
    <Switch>
      <Route path="/" exact component={(props: any) => <Home {...props} />} />
      <Route path="/login/github/return" component={GithubLogin} />
      <Route
        path="/explore"
        component={(props: any) => <Explore {...props} />}
      />
      <PrivateRoute path="/profile" component={Profile} />
      <PrivateRoute path="/logout" component={Logout} />
      <Route path="/500" component={Error500Page} />
      <Route path="/404" component={Error404Page} />
      <Redirect to="/404" />
    </Switch>
  </React.Suspense>
);

export default Routes;
