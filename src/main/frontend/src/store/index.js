import { configureStore } from '@reduxjs/toolkit';
import goodsReducer from '@/store/goods'
import memberReducer from '@/store/member'

const store = configureStore({
    reducer : {
      goods : goodsReducer,
      member : memberReducer,
    }
})

export default store; 