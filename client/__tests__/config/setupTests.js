import React from 'react';
import 'jest-styled-components';

function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      var keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

global.React = React;
global.fetch = require('jest-fetch-mock');
global.localStorage = storageMock();

window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener: function() {},
      removeListener: function() {}
    };
  };

global.user = '59ed5b03992843434f6fc8bb';
global.token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZWQ1YjAzOTkyODQzNDM0ZjZmYzhiYiIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTUwOTU0NjI0NSwiZXhwIjoxNTA5NzE5MDQ1fQ.Go22Ea4XIILguaM7G-Hek27-aDUI7r0OnMT6MTq72s8';