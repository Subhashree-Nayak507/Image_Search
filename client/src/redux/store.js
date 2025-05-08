import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth/index'
import searchReducer from './search/index'

const store=configureStore({
    reducer:{
        auth:authReducer,
        search:searchReducer
    }
})

export default store

