import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './App';
import MainPage from './components/MainPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route exact path="/main">
        <MainPage />
      </Route>
    </Switch>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
