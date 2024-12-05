import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

const goodsSlice = createSlice({
  name : 'goods',
  initialState : {
    newGoods : [],
    bestGoods : [],
    cartCount : 0,
  },
  reducers : {
    initNewGoods(state, action){
      state.newGoods = action.payload
    },
    initBestGoods(state, action){
       state.bestGoods = action.payload
    },
    initCartCount(state, action){
      state.cartCount = action.payload
    },
    changeCategory(state, action){
      state.category = action.payload
    },
    changePageGroup(state, action){
      state.pageGroup = action.payload
    },
    changePageNum(state, action){
      state.pageNum = action.payload
    }
  }
})

export const { initNewGoods, initBestGoods, initCartCount, changeCategory, changePageGroup, changePageNum } = goodsSlice.actions;

export const fetchNewGoods = ()=> async dispatch => {
  try {
    const response =  await axios.get(`${import.meta.env.VITE_API_URL}/goods/mainGoods`, {params: {g_type:"new"}})
    console.log(response.data)
    dispatch(initNewGoods(response.data))
  } catch (error) {
      console.error('Error fetching newGoods:', error);
  }
}

export const fetchBestGoods = ()=> async dispatch => {
  try {
    const response =  await axios.get(`${import.meta.env.VITE_API_URL}/goods/mainGoods`, {params : { g_type:"best" }})
    console.log(response.data)
    dispatch(initBestGoods(response.data))
  } catch (error) {
      console.error('Error fetching bestGoods:', error);
  }
}

export const fetchCart = (m_no)=> async dispatch => {
  try {
    const token = localStorage.getItem('token');
    const response =  await axios.get(`${import.meta.env.VITE_API_URL}/cart/cartGoodsCount`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { m_no }
  })
    console.log(response.data)
    dispatch(initCartCount(response.data))
  } catch (error) {
      console.error('Error fetching cart:', error);
  }
}



export default goodsSlice.reducer;