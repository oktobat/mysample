import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

const memberSlice = createSlice({
  name : 'member',
  initialState : {
    user : null,
    myReviewList : null,
  },
  reducers : {
    userLogin(state, action){
      state.user = action.payload
    },
    userLogout(state, action){
        state.user = null
    },
    initMyReviewList(state, action) {
      state.myReviewList = action.payload
    }
  }
})

export const { userLogin, adminLogin, userLogout, adminLogout, initMyReviewList } = memberSlice.actions;

export const fetchReviews = (m_no)=> async dispatch => {
  try {
    const response =  await axios.get(`${import.meta.env.VITE_API_URL}/review/myReviewList`, {params:{m_no:m_no}});
    console.log("나왔니",response.data)
    dispatch(initMyReviewList(response.data))
  } catch (error) {
      console.error('Error fetching review:', error);
  }
}

export default memberSlice.reducer;