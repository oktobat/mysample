import React, { useEffect } from 'react';
import ReviewListSection from '@/components/goods/ReviewListSection'
import { useSelector, useDispatch } from 'react-redux'
import { fetchReviews } from '@/store/member'

const ReviewListView = () => {
  const dispatch = useDispatch()
  const user = useSelector(state=>state.member.user)
  const myReviewList = useSelector(state=>state.member.myReviewList)
  
  useEffect(() => {
    if (user && user.m_no) {
      dispatch(fetchReviews(user.m_no));
    }
  }, [user, dispatch]);

  return (
    <div>
      <ReviewListSection myReviewList={myReviewList} />
    </div>
  );
};

export default ReviewListView;