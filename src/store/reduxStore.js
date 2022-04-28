import { configureStore } from '@reduxjs/toolkit';

import aesReducer from './aesStore-slice';

import desReducer from './desStore-slice';


const store = configureStore({
  reducer: { aes: aesReducer, des: desReducer },
});

export default store;