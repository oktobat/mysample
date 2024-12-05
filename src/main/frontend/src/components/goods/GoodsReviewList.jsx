import React, {useState, useEffect} from 'react';
import Pagenation from '@/components/common/Pagenation'
import styled from 'styled-components'

const GoodsReviewListBlock = styled.div`
  h2 { text-align:left; padding:10px 0px; margin-top:20px; font-size:16px; font-weight:normal }
  th { border:1px solid #ddd; padding:15px 5px; 
      border-left:none; border-right:none; 
      font-weight:normal; text-align:center  }
  td { border:1px solid #ddd; padding:15px 5px; 
      border-left:none; border-right:none; 
      font-weight:normal; text-align:center  }
  tr.photoImg + tr { display:none }
  tr.photoImg.on + tr { display:table-row }
`

const GoodsReviewList = ({type, reviewList, totalCount, pageVo, onPageChange }) => {
  const [activePhotoIndexes, setActivePhotoIndexes] = useState({});

  useEffect(() => {
    // type이 'photo'일 때 activePhotoIndexes 초기화
    if (type === 'photo') {
      const initialIndexes = {};
      reviewList.forEach((_, index) => {
        initialIndexes[index] = false;
      });
      setActivePhotoIndexes(initialIndexes);
    }
  }, [type, reviewList]);

  const handleRowClick = (index) => {
    setActivePhotoIndexes((prevIndexes) => ({
      ...prevIndexes,
      [index]: !prevIndexes[index] // 해당 index의 값이 true이면 false로, false이면 true로 토글
    }));
  };

  return (
    <GoodsReviewListBlock className={ type=='photo' ? 'photoReviewBox' : 'textReviewBox' }>
        <h2>{ type=='photo' ? "포토 상품평" : "일반 상품평"} (총 <span style={{ color:'red'}}>{totalCount}</span> 건)</h2>
        <table>
            <thead>
                <tr>
                    <th>고객만족도</th>
                    <th>상품평</th>
                    <th>구매자</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                {reviewList.map((review, index) => (
                <>
                  <tr key={index}
                    className={
                      type === 'photo'
                        ? activePhotoIndexes[index]
                          ? 'photoImg on'
                          : 'photoImg'
                        : ''
                    }
                    onClick={type === 'photo' ? () => handleRowClick(index) : undefined}
                  >
                    <td style={{ color: '#f00' }}>{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}</td>
                    <td>{review.comment}</td>
                    
                    {/* 이메일이 한글자일때는 아래 코드에 오류 발생함 */}
                    <td>
                      {review.m_email.length > 1 ? review.m_email[0] + '*'.repeat(review.m_email.length - 2) + review.m_email.slice(-1) : review.m_email[0] + '*'}
                    </td>
                    <td>{new Date(review.rv_reg_date).toLocaleDateString()}</td>
                  </tr>
                  {type === 'photo' && (
                    <tr>
                      <td colSpan="4">
                        {review.images &&
                          review.images.split(",").map((img, i) => (
                            <img
                              key={i}
                              src={`${import.meta.env.VITE_API_URL}/goodsImg/${img}`}
                              alt="리뷰 이미지"
                            />
                          ))}
                      </td>
                    </tr>
                  )}
                </>
                ))}
            </tbody>
        </table>
        <Pagenation pageVo={pageVo} onPageChange={onPageChange} />
    </GoodsReviewListBlock>
  );
};

export default GoodsReviewList;