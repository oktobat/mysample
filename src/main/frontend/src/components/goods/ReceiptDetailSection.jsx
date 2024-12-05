import React, {useState, useEffect, Link} from 'react';
import ReviewModal from '@/components/goods/ReviewModal'
import styled from 'styled-components'

const ReceiptDetailSectionBlock = styled.div`
.prevNext { margin:50px 0; }
.receiptInfo { text-align:center; margin:20px 0;
  col:nth-child(1) { width:100px }
  col:nth-child(2) { width:auto }
  col:nth-child(3) { width:100px }
  col:nth-child(4) { width:100px }
  th, td { border:1px solid #4c4c4c }
  thead {th { padding:15px 0 }}
  tbody {td { text-align:center }}
}

`

const ReceiptDetailSection = ({receiptDetailList}) => {
  const [openModal, setOpenModal] = useState(false)
  const closeModal = () => setOpenModal(false);
  const [receiptDetailItems, setReceiptDetailItems] = useState(receiptDetailList)
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
    if (receiptDetailList !== null) {
      setReceiptDetailItems(receiptDetailList);
    }
  }, [receiptDetailList]);

  const onReviewComplete = (detailNo) => {
    setReceiptDetailItems(prevItems =>
        prevItems.map(item =>
            item.receipt_detail_no === detailNo ? { ...item, reviewed: 'Y' } : item
        )
    );
    closeModal();
  };

  const onModalClose = ()=>{
    setReviewedItem(null)
    closeModal()
  }


  return (
    <ReceiptDetailSectionBlock className="inner">
      <div className="prevNext">
          <a href="#" onClick={() => window.history.back()}>뒤로가기</a>
        </div>
        <div className="title">
          <h2>영수증 상세내역</h2>
        </div>
        <div className="receiptDetailBox">
          <table className="receiptInfo">
              <colgroup>
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
                  <th>리뷰확인</th>
                </tr>
              </thead>
              <tbody>
                {
                  receiptDetailItems.map(item=>(
                      <tr key={item.receipt_detail_no}>
                        <td>
                            <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} style={{ width: '100px', height: '100px' }} />
                        </td> 
                        <td>
                            {item.g_name}
                        </td>
                        <td>{item.g_price.toLocaleString()}</td>
                        <td>
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
        <ReviewModal 
        openModal={openModal} 
        reviewedItem={reviewedItem} 
        onReviewComplete={onReviewComplete}
        onModalClose={onModalClose} />
    </ReceiptDetailSectionBlock>
  );
};

export default ReceiptDetailSection;