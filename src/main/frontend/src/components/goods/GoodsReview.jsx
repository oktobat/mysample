import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components'
import PhotoReview from '@/components/goods/PhotoReview'
import TextReview from '@/components/goods/TextReview'

const GoodsReviewBlock = styled.div`
  .reviewTotal { display:flex; 
    justify-content:space-between;
    margin:40px 0;
    border:1px solid #ddd; padding:20px;
    strong { color:#f00 }
  }
  col:nth-child(1) { width:150px }
  col:nth-child(2) { width:auto }
  col:nth-child(3) { width:150px }
  col:nth-child(4) { width:150px }
  td:nth-child(2) { text-align:left}

`

const GoodsReview = ({goodsVo}) => {
  const [photoReviewList, setPhotoReviewList] = useState([]);
  const [textReviewList, setTextReviewList] = useState([]);
  const [photoTotalCount, setPhotoTotalCount] = useState(0);
  const [textTotalCount, setTextTotalCount] = useState(0);
  const [photoPageVo, setPhotoPageVo] = useState({});
  const [textPageVo, setTextPageVo] = useState({});

    // 포토리뷰 요청하기
    const loadPhotoReview = async (pageGroup, pageNum) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/review/photoReviewData`, {
                params: { pageGroup, pageNum, g_no: goodsVo.g_no },
                cache: false,
            });
            const { photoReviewList, totalCount, pageVo } = response.data;
            setPhotoReviewList(photoReviewList);
            setPhotoTotalCount(totalCount);
            setPhotoPageVo(pageVo);
        } catch (error) {
            console.error("Error loading photo reviews", error);
        }
    };

    // 텍스트리뷰 요청하기
    const loadTextReview = async (pageGroup, pageNum) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/review/textReviewData`, {
                params: { pageGroup, pageNum, g_no: goodsVo.g_no },
                cache: false,
            });
            const { textReviewList, totalCount, pageVo } = response.data;
            setTextReviewList(textReviewList);
            setTextTotalCount(totalCount);
            setTextPageVo(pageVo);
        } catch (error) {
            console.error("Error loading text reviews", error);
        }
    };

    useEffect(() => {
        if (goodsVo.g_no) {
            loadPhotoReview(1, 1); // Load photo reviews on initial render
            loadTextReview(1, 1);  // Load text reviews on initial render
        }
    }, [goodsVo.g_no]);

    const handlePhotoPageChange = (newPage) => {
        const newPageGroup = Math.ceil(newPage / 10);
        loadPhotoReview(newPageGroup, newPage);
    };

    const handleTextPageChange = (newPage) => {
        const newPageGroup = Math.ceil(newPage / 10);
        loadTextReview(newPageGroup, newPage);
    };


  return (
    <GoodsReviewBlock>
      <div className="reviewTotal">
        <span>고객만족도 평균 : <strong>{goodsVo.average_rating.toFixed(1) }</strong>점</span>
        <span>상품평 : 총 <strong>{goodsVo.review_count}</strong>건</span>
      </div>
      <PhotoReview type="photo" reviewList={ photoReviewList } totalCount={photoTotalCount } pageVo={photoPageVo} onPageChange={handlePhotoPageChange} />
      <TextReview type="text" reviewList={textReviewList } totalCount={textTotalCount } pageVo={textPageVo} onPageChange={handleTextPageChange} />
    </GoodsReviewBlock>
  );
};

export default GoodsReview;