import React from 'react';
import styled from 'styled-components'
import {Link} from 'react-router-dom'

const OrderListSectionBlock = styled.div`
  .orderInfo { text-align:center; margin:20px 0;
    col:nth-child(1) { width:200px }
    col:nth-child(2) { width:100px }
    col:nth-child(3) { width:auto }
    col:nth-child(4) { width:100px }
    col:nth-child(5) { width:100px }
    col:nth-child(6) { width:120px }
    thead { th { padding:15px 0; border:1px solid #4c4c4c } }
    tbody { 
      td { text-align:center; border:1px solid #4c4c4c;
        a.btn { padding:5px; background:#ddd; border-radius:3px; border:1px solid #999 }
      } 
    }
  }
`

const OrderListSection = ({orderList}) => {
  return (
    <OrderListSectionBlock className="inner">
      <div className="title">
        <h2>나의 주문목록</h2>
      </div>
      <div className="orderBox">
        { orderList.length > 0 ?
          <div className="orderList">
            <table className="orderInfo">
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
                  <th>주문일/주문번호</th>
                  <th>이미지</th>
                  <th>상품정보</th>
                  <th>배송상태</th>
                  <th>확인/신청</th>
                  <th>주문상세내역</th>
                </tr>
              </thead>
              <tbody>
                {orderList.map(item => (
                  <tr key={item.order_no}>
                    <td>
                      <span>{item.order_reg_date}</span><br />
                      <span style={{ color: '#eb1414' }}>{item.order_id}</span>
                    </td>
                    <td>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`}
                        alt={item.item_name}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td>
                      <span>{item.item_name}</span><br />
                      <span>받는이 : {item.receiver_name}</span><br />
                      <span>{item.final_amount.toLocaleString()}원</span>
                    </td>
                    <td>
                      <a className="btn" href="#">{item.shipping_status}</a>
                    </td>
                    <td>
                      <a className="btn" href="#">반품/교환</a>
                    </td>
                    <td>
                      <Link className="btn" to={`/myOrderDetail/${item.order_no}`}>
                        주문상세내역
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          :
          <div style={{ margin: '100px', textAlign: 'center', fontSize: '50px' }}>
            주문한 상품이 없습니다!!
          </div>
        }
      </div>
    </OrderListSectionBlock>
  );
};

export default OrderListSection;