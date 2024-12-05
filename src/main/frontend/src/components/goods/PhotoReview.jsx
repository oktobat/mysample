import React from 'react';
import GoodsReviewList from '@/components/goods/GoodsReviewList'

const PhotoReview = ({type, reviewList, totalCount, pageVo, onPageChange }) => {
  return (
    <GoodsReviewList type={type} reviewList={ reviewList } totalCount={totalCount } pageVo={pageVo} onPageChange={onPageChange} />
  );
};

export default PhotoReview;