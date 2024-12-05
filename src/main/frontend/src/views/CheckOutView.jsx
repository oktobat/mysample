import React from 'react';
import CheckOutListSection from '@/components/goods/CheckOutListSection'
import { useLocation } from 'react-router-dom'

const CheckOutView = () => {
  const location = useLocation();
  const { checkOutList } = location.state
  console.log("체크아웃"+checkOutList)
  return (
    <div>
      <CheckOutListSection checkOutList={checkOutList} />
    </div>
  );
};

export default CheckOutView;