import 'es6-promise/auto';
import React from 'react';
import ReactDOM from 'react-dom';
import Controller from './controller/controller';
import 'babel-polyfill'; // 解析es7 async

const appContainer = document.getElementById('app');

ReactDOM.render(<Controller />, appContainer);