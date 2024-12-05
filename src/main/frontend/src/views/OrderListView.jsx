import React, {useState, useEffect } from 'react';
import OrderListSection from '@/components/goods/OrderListSection'
import { useSelector } from 'react-redux'
import axios from 'axios'

const OrderListView = () => {
  const user = useSelector(state=>state.member.user)
  const [orderList, setOrderList] = useState([])

  const fetchOrderList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/order/myOrderList`, {params:{m_no:user.m_no}});
      console.log("주문리스트"+response.data)
      setOrderList(response.data)
    } catch (error) {
      console.error("주문리스트 로드 실패:", error);
    }
  };

  useEffect(() => {
    // 장바구니 데이터 로드
    fetchOrderList();
  }, []);

  return (
    <div>
      <OrderListSection orderList={orderList} />
    </div>
  );
};

export default OrderListView;