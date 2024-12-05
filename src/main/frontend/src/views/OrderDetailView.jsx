import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom"
import OrderDetailSection from '@/components/goods/OrderDetailSection'
import axios from 'axios'

const OrderDetailView = () => {
  const { odno } = useParams()

  const [orderDetailList, setOrderDetailList] = useState([])

  const fetchOrderDetailList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/myOrderDetailList`, {params:{order_no:odno}});
      console.log("주문상세리스트"+response.data)
      setOrderDetailList(response.data)
    } catch (error) {
      console.error("주문상세리스트 로드 실패:", error);
    }
  };

  useEffect(() => {
    // 장바구니 데이터 로드
    fetchOrderDetailList();
  }, []);

  return (
    <div>
      <OrderDetailSection orderDetailList={orderDetailList} />
    </div>
  );
};

export default OrderDetailView;