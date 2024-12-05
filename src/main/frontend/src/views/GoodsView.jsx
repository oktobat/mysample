import React, {useEffect, useState} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GoodsList from '@/components/goods/GoodsList'
import Pagenation from '@/components/common/Pagenation'
import axios from 'axios';

const GoodsView = () => {
  const { category } = useParams(); 
  const location = useLocation();
  const { title, getData } = location.state
  const [goods, setGoods] = useState([]);
  const [pageVo, setPageVo] = useState({})
  const [pageData, setPageData] = useState({});

  const fetchGoods = async (loadData) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/goods/categoryData`, {params:loadData})
      setGoods(response.data.goodsList);
      setPageVo(response.data.pageVo);
    } catch(error) {
      console.error("상품 데이터를 불러오지 못했습니다:", error);
    } 
  }

  const searchGoods = async (loadData) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/goods/searchData`, {params:loadData})
      setGoods(response.data.goodsList);
      setPageVo(response.data.pageVo);
    } catch(error) {
      console.error("상품 데이터를 불러오지 못했습니다:", error);
    } 
  }

  useEffect(()=>{
    setPageData(getData)
    if (category=='search'){
      searchGoods(getData)
    } else {
      fetchGoods(getData)
    }
  }, [category, getData])

  const handlePageChange = (pageNum) => {
    let pageGroup = Math.ceil(pageNum / 10);  
    console.log(pageNum)
    setPageData({category:pageData.category, pageGroup, pageNum })
    if (category=='search'){
      searchGoods({category:pageData.category, pageGroup, pageNum })
    } else {
      fetchGoods({category:pageData.category, pageGroup, pageNum })
    }
  };


  return (
    <div className="inner">
      <div className="title">
        <h2>{category == 'search' ? title+"에 대한 검색결과" : title }</h2>
      </div>
      <GoodsList goods={goods} fetchList={ category=='search' ? searchGoods : fetchGoods} pageData={pageData} title={title} category={category} />
      <Pagenation pageVo={pageVo} onPageChange={handlePageChange} />
    </div>
  );
};

export default GoodsView;