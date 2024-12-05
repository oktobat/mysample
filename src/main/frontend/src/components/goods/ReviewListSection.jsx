import React, {useState, useEffect } from 'react';
import styled from 'styled-components'
import ReviewModal from '@/components/goods/ReviewModal'

const ReviewListSectionBlock = styled.div`
  col:nth-child(1) { width:100px }
  col:nth-child(2) { width:200px }
  col:nth-child(3) { width:auto }
  col:nth-child(4) { width:80px }
  col:nth-child(5) { width:200px }
  col:nth-child(6) { width:80px }
  th, td { border:1px solid #ddd; padding:10px 0px; text-align:center }
  td:nth-child(3) { text-align:left; text-indent:1em }
`

const ReviewListSection = ({myReviewList}) => {
  const [openModal, setOpenModal] = useState(false)
  const closeModal = () => setOpenModal(false);
  const [reviewedItem, setReviewedItem] = useState(null)
  const [updateReviewList, setUpdateReviewList] = useState(myReviewList)

  const reviewWrite = (selectItem)=>{
    console.log("리뷰작성"+JSON.stringify(selectItem))
    setReviewedItem(selectItem)
  }

  const reviewModify = (selectItem)=>{
    console.log("리뷰수정"+JSON.stringify(selectItem))
    setReviewedItem(selectItem)
  }

  useEffect(() => {
    if (reviewedItem !== null) {
      setOpenModal(true);
      setUpdateReviewList(myReviewList)
    }
  }, [reviewedItem, myReviewList]);
  
  const onReviewComplete = (reItem) => {
    setUpdateReviewList(prevItems =>
        prevItems.map(item =>
            item.order_detail_no === reItem.detailNo ? { ...item, reviewed: 'Y', comment:reItem.comment, rv_mod_date:new Date().toLocaleString()} : item
        )
    );
    closeModal();
  };


   const onModalClose = ()=>{
    setReviewedItem(null)
    closeModal()
  }


  return (
    <ReviewListSectionBlock className="inner">
      <div className="title">
        <h2>나의 상품평 관리</h2>
      </div>
      <table>
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>번호</th>
            <th>상품명</th>
            <th>내용</th>
            <th>리뷰상태</th>
            <th>날짜</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {updateReviewList?.map((item, index) => (
            <tr
              key={index}
            >
              <td>{index + 1}</td>
              <td>{item.g_name}</td>
              <td className="comm">{item.comment}</td>
              {/* 리뷰 상태에 따른 버튼 렌더링 */}
              <td className={item.review_no!==0 ? 'reviewModify' : 'reviewBtn'}>
                {item.review_no!==0 ? (
                  <button
                    type="button"
                    onClick={() => reviewModify(item)} 
                    style={{ background: "#555", color: "#fff" }}
                  >
                    리뷰수정
                  </button>
                ) : (
                  <button type="button" 
                  onClick={ ()=>reviewWrite(item) }
                  style={{ border: "1px solid #000" }}>
                    리뷰작성
                  </button>
                )}
              </td>
              {/* 날짜 표시 */}
              <td className="date">{item.rv_reg_date ? item.rv_mod_date : ''}</td>
              {/* 리뷰 삭제 버튼 */}
              <td className="reviewDel">
                {item.rv_reg_date && (
                  <button
                    type="button"
                    onClick={() => removeReview(review.review_no)}
                    style={{ background: '#999', color: '#fff' }}
                  >
                    리뷰삭제
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      { openModal &&
        <ReviewModal 
          openModal={openModal} 
          reviewedItem={reviewedItem} 
          onReviewComplete={onReviewComplete}
          onModalClose={onModalClose} />
      }
    </ReviewListSectionBlock>
  );
};

export default ReviewListSection;