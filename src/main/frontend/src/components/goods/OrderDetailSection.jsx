import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import ReviewModal from '@/components/goods/ReviewModal'

const OrderDetailSectionBlock = styled.div`
  .prevNext { margin:50px 0; }
  .orderInfo { text-align:center; margin:20px 0;
    col:nth-child(1) { width:100px }
    col:nth-child(2) { width:auto }
    col:nth-child(3) { width:100px }
    col:nth-child(4) { width:100px }
    col:nth-child(5) { width:100px }
    col:nth-child(6) { width:180px }
    col:nth-child(7) { width:100px }
    th, td { border:1px solid #4c4c4c }
    thead {th { padding:15px 0 }}
    tbody {td { text-align:center }}
  }
`

const OrderDetailSection = ({orderDetailList}) => {
  const [openModal, setOpenModal] = useState(false)
  const closeModal = () => setOpenModal(false);
  const [orderDetailItems, setOrderDetailItems] = useState(orderDetailList)
  const [reviewedItem, setReviewedItem] = useState(null)

  const reviewWrite = (selectItem)=>{
    setReviewedItem(selectItem)
  }

  useEffect(() => {
    if (reviewedItem !== null) {
      setOpenModal(true);
    }
  }, [reviewedItem]);

  useEffect(() => {
    if (orderDetailList !== null) {
      setOrderDetailItems(orderDetailList);
    }
  }, [orderDetailList]);

  const onReviewComplete = (detailNo) => {
    setOrderDetailItems(prevItems =>
        prevItems.map(item =>
            item.order_detail_no === detailNo ? { ...item, reviewed: 'Y' } : item
        )
    );
    closeModal();
  };

  const onModalClose = ()=>{
    setReviewedItem(null)
    closeModal()
  }

  return (
    <OrderDetailSectionBlock className="inner">
      <div className="prevNext">
        <a href="#" onClick={() => window.history.back()}>뒤로가기</a>
	    </div>
      <div className="title">
        <h2>주문상세내역</h2>
      </div>
      <div className="orderDetailBox">
        <div className="orderDetailList">
          <table className="orderInfo">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>상품가격</th>
                <th>주문수량</th>
                <th>금액</th>
                <th>주문일</th>
                <th>리뷰확인</th>
              </tr>
            </thead>
            <tbody>
              {
                orderDetailItems.map(item=>(
                  <tr key={item.order_detail_no}>
                    <td>
                      <Link to={`/goodsDetail/${item.g_no}`} state={{item:item }}>
                        <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} style={{ width: '100px', height: '100px' }} />
                      </Link>
                    </td>
                    <td>
                      <Link to={`/goodsDetail/${item.g_no}`} state={{item:item }}>
                        {item.g_name}
                      </Link>
                    </td>
                    <td>{item.g_price.toLocaleString()}</td>
                    <td>{item.order_qty}개</td>
                    <td>{(item.g_price*item.order_qty).toLocaleString()}원</td>
                    <td>{item.od_reg_date}</td>
                    <td className="reviewBtn">
                      {item.reviewed === 'N' ? (
                        <button type="button" onClick={ ()=>reviewWrite(item) }>리뷰쓰기</button>
                      ) : (
                        <button type="button" disabled>리뷰완료</button>
                      )}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <ReviewModal 
        openModal={openModal} 
        reviewedItem={reviewedItem} 
        onReviewComplete={onReviewComplete}
        onModalClose={onModalClose} />
    </OrderDetailSectionBlock>
  );
};

export default OrderDetailSection;