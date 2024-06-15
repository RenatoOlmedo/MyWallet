import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { Layout } from './components/Layout';
import {Provider} from 'react-redux'
import { createStore } from 'redux';
import './scss/style.scss';
import rootReducer from './reducers';



export default class App extends Component {
  static displayName = App.name;
  static store = createStore(rootReducer)

  render() {
    return (
      <Provider store={App.store}>
            <Layout className="dark">
            <Routes>
              {AppRoutes.map((route, index) => {
                const { element, requireAuth, ...rest } = route;
                return <Route key={index} {...rest} element={requireAuth ? <AuthorizeRoute {...rest} element={element} /> : element} />;
              })}
            </Routes>
      </Layout>
      </Provider>
    );
  }
}
