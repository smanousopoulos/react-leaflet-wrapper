import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './src/';

render(
  <BrowserRouter basename="/react-leaflet-wrapper">
    <App />
  </BrowserRouter>,
  document.getElementById('app')
);
