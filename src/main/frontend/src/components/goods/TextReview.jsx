import React from 'react';
import styled from 'styled-components'
import GoodsReviewList from '@/components/goods/GoodsReviewList'

const TextReview = ({type, reviewList, totalCount, pageVo, onPageChange }) => {
  return (
    <GoodsReviewList type={type} reviewList={ reviewList } totalCount={totalCount } pageVo={pageVo} onPageChange={onPageChange} />
  );
};

export default TextReview;