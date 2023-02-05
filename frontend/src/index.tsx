import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Main from './Main';
import reportWebVitals from './reportWebVitals';

import "@fortawesome/fontawesome-free/js/all";

import "primereact/resources/themes/lara-light-indigo/theme.css";  
import "primereact/resources/primereact.min.css";                  
import "primeicons/primeicons.css";

import { store } from './Store'
import { Provider } from 'react-redux'

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

const router = createHashRouter([{
    path: "*",
    element: <Main />
}]);


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
