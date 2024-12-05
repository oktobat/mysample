import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name:"boards",
  initialState:{
    notice : [], // [ {writer:"", subject:"", content:"", date:"", hit:0} ]
  },
  reducers : {
    initNotice(state, action){
      state.notice.unshift(action.payload)
      console.log("찍혀라", state.notice[0])
    },
    modifyNotice(state, action){
      const {writer, subject, content, date, hit} = action.payload
      const index = state.notice.findIndex(item=>item.date==date)
      if (index!==-1) {
        state.notice[index] = {writer:writer, subject:subject, content:content, date:date, hit:hit }
      }
    },
    removeNotice(state, action){
      const {date} = action.payload
      const index = state.notice.findIndex(item=>item.date==date)
      if (index!==-1) {
        state.notice.splice(index, 1)
      }
    },
    modifyHit(state, action){
      const {writer, subject, content, date, hit} = action.payload
      const index = state.notice.findIndex(item=>item.date==date)
      if (index!==-1) {
        state.notice[index] = {writer:writer, subject:subject, content:content, date:date, hit:hit+1 }
      }
    }
  }
})

export const { initNotice, modifyNotice, removeNotice, modifyHit } = boardSlice.actions;

export default boardSlice.reducer;