import React, {useState} from 'react';
import styled from 'styled-components'
import {useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '@/store/goods'
import { useNavigate } from 'react-router-dom'
import openDaumPostcode from '@/components/utils/DaumPostcode';
import axios from 'axios'


const CheckOutListSectionBlock = styled.div`
.box { border-top:2px solid #8c0000; padding:30px 0; margin-bottom:50px;
  > p { margin-bottom:30px; font-size:20px;  }
}
.deliveryInfo {
  #m_name  { width:100px; height:25px; text-align:center; vertical-align:middle }
	#m_hp1  { width:100px; height:25px; text-align:center; vertical-align:middle }
	#m_hp2  { width:100px; height:25px; text-align:center; vertical-align:middle }
	#m_hp3  { width:100px; height:25px; text-align:center; vertical-align:middle }
	#m_zipcode { width:100px; height:25px; text-align:center; vertical-align:middle }
  #prof_zipcode { background:#eb1414; color:#fff; width:100px; height:25px; border-radius:5px  }
	#m_address { width:500px; height:25px; margin-bottom:10px; text-indent:1em }
	#m_address_sub { width:500px; height:25px; margin-bottom:10px; text-indent:1em }
}

.itemsInfo {
    > li { display:flex; align-items:center; border-top:1px solid #ddd; padding:10px 0;
      &:last-child { border-bottom:1px solid #ddd   }
      img {width:100px; margin-right:20px }
      .gName {flex:1 }
      .gAmount {width:150px; span { font-size:20px; } }
    }
}

.lrBox { display:flex; align-items:flex-start; 
  .leftBox { flex:1; margin-right:50px; }
  .rightBox { width:300px; border:1px solid #ddd; padding:10px;
    p { line-height:3em; display:flex; justify-content:space-between }
    .checkoutBtn { display:flex; background:#eb1414; color:#fff; 
      padding:20px 0; justify-content:center; 
      cursor:pointer; margin-top:20px }
  }
}

`

const CheckOutListSection = ({checkOutList}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.member.user)
  const dfee = 3000
  const orderAmount = () => {
    return checkOutList.reduce((total, item) => total + (item.g_price * item.cart_qty), 0);
  };

  const [form, setForm] = useState({
    m_name:user.m_name,
    m_hp1:user.m_hp1,
    m_hp2:user.m_hp2,
    m_hp3:user.m_hp3,
    m_zipcode:user.m_zipcode,
    m_address:user.m_address,
    m_address_sub:user.m_address_sub
  })

  const openPostcode = () => {
    openDaumPostcode(({ zonecode, address }) => {
      setForm((prevForm) => ({
        ...prevForm,
        m_zipcode: zonecode,
        m_address: address,
      }));

      // 상세주소 필드에 포커스
      document.querySelector("#m_address_sub").focus();
    });
  };

  const createOrderNum = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const sec = String(date.getSeconds()).padStart(2, "0");
    let orderNum = year + month + day + hour + min + sec;  // "20241010111705"+75021
        
    for (let i = 0; i < 5; i++) {
      orderNum += Math.floor(Math.random() * 8);
    }
    return orderNum
  }

  let IMP = window.IMP
  IMP.init("imp26703463") 

  const requestPay = ()=>{
    const orderNumber = createOrderNum()
    let order = {
      order_id : orderNumber,
      m_no : user.m_no,
      order_amount : orderAmount(),
      shipping_cost : dfee,
      payment_status : "결제완료",
      receiver_name : user.m_name,
      receiver_phone : user.m_hp1+""+user.m_hp2+""+user.m_hp3,
      shipping_zipcode : user.m_zipcode,
      shipping_address : user.m_address+" "+user.m_address_sub,
      shipping_status : "상품준비중"
    }

    IMP.request_pay({
      pg: 'kakaopay.TC0ONETIME',
      merchant_uid: orderNumber,
      name: "테스트결제",
      amount: orderAmount()+dfee,
      buyer_email: "tsalt@hanmail.net",
      buyer_name: "김은영",
      buyer_tel: "010-8156-2407",
      buyer_addr: "서울시 구로구",
      buyer_postcode: "12345"
    }, async function (rsp) {
      if (rsp.success) {
          try {
              const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify/${rsp.imp_uid}`);
              console.log("찍어봐"+JSON.stringify(verifyResponse))
              if (rsp.paid_amount === verifyResponse.data.response.amount) {
                  alert("결제완료");
                  try {
                      console.log("Order:", order);
                      console.log("CheckOutList:", checkOutList);
                      const payload = { order, checkOutList }
                      await axios.post(`${import.meta.env.VITE_API_URL}/payment/orderRegister`, payload, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                      });
                      alert("주문성공");
                      dispatch(fetchCart(user.m_no));
                      navigate('/orderFinish')
                  } catch (err) {
                      console.error("주문 등록 오류:", err);
                      alert("주문 등록 오류: " + err.response.data);
                      // try {
                      //   await axios.get(`${import.meta.env.VITE_API_URL}/payment/paymentCancel?order_id=${orderNumber}`);
                      //     alert("결제가 취소되었습니다.");
                      // } catch (err) {
                      //     console.error("결제 취소 오류:", err);
                      //     alert("결제 취소 오류");
                      // }
                  }
              } else {
                  alert("결제오류");
                  try {
                      await axios.get(`${import.meta.env.VITE_API_URL}/payment/paymentCancel?order_id=${orderNumber}`);
                      alert("결제가 취소되었습니다.");
                  } catch (err) {
                      console.error("결제 취소 오류:", err);
                      alert("결제 취소 오류");
                  }
              }
          } catch (err) {
              await axios.get(`${import.meta.env.VITE_API_URL}/payment/paymentCancel?order_id=${orderNumber}`);
              alert("결제가 취소되었습니다.");
              console.error("결제 검증 오류:", err);
              alert("결제 검증 오류");
          }
      } else {
          alert(rsp.error_msg);
      }
    });
  }
 

  return (
    <CheckOutListSectionBlock>
      <div className="inner">
        <div className="title">
          <h2>결제하기</h2>
        </div>
      </div>
      <div className="inner lrBox">
        <div className="leftBox">
          <div className="box">
            <p>구매자</p>
            <div className="buyerInfo">
                <span className="buyerName">{user.m_name || "" }</span>
                (연락처 : <span className="buyerTel">{user.m_hp1 || ""  }-{user.m_hp2 || "" }-{user.m_hp3 || "" }</span>)<br />
                <span className="buyerPostcode">{user.m_zipcode  || "" }</span>
                <span className="buyerAddr">{user.m_address  || "" } {user.m_address_sub  || "" }</span>
                <span className="buyerNo" style={{visibility:'hidden'}}>{user.m_no  || "" }</span>
                <span className="buyerEmail" style={{visibility:'hidden'}}>{user.m_email  || "" }</span>
            </div>
          </div>
          <div className="box">
            <p>배송지<span style={{color:'#eb1414', fontSize:'16px'}}>(수정가능)</span></p>
            <div className="deliveryInfo">
              <p><input type="text" name="m_name" id="m_name" value={form.m_name } /> <input type="text" name="m_hp1" value={form.m_hp1  } id="m_hp1"/>ㅡ<input type="text" name="m_hp2" value={form.m_hp2 } id="m_hp2"/>ㅡ<input type="text" name="m_hp3" value={form.m_hp3 } id="m_hp3"/></p>
              <p style={{display:'flex', alignItems:'center', margin:'20px 0 10px'}}>
                <input type="text" name="m_zipcode" value={form.m_zipcode } id="m_zipcode" onClick={openPostcode} style={{marginRight:'5px'}}/>
                <input type="button" value="배송지변경" id="prof_zipcode" onClick={openPostcode}/>
              </p>
                <input type="text" name="m_address" value={form.m_address } id="m_address" placeholder="기본주소" /> <br /> 
                <input type="text" name="m_address_sub" value={form.m_address_sub } id="m_address_sub"  placeholder="상세주소" /><br />
            </div>
          </div>
          <div className="box">
            <p>주문상품 : {checkOutList.length}개</p>
            <ul className="itemsInfo">
              { checkOutList.map((item, index)=>(
                <li key={index}>
                  <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} />
                  <span className="gName">{item.g_name }</span>
                  <div className="gAmount">
                    <span>{(item.g_price * item.cart_qty).toLocaleString() }</span>원 <br />
                    수량 { item.cart_qty}개
                  </div>
                </li>
              ))
              }
            </ul>
          </div>
        </div>
        <div className="rightBox">
          <div className="amount">
            <p>주문금액 : <span className="orderAmount">{orderAmount().toLocaleString()}원</span></p>
            <p>배송비 : <span>{dfee.toLocaleString()}원</span></p>
            <p style={{borderTop:'1px solid #ddd'}}>결제예정금액 : <span className="orderTotalAmount">{(orderAmount()+dfee).toLocaleString()}원</span></p>
          </div>
          <div className="checkoutBtn" onClick={requestPay}>
            <span className="orderTotalAmount" style={{transform:'scale(1.5)', paddingRight:'1em'}}></span>결제하기
          </div>
        </div>
      </div>
    </CheckOutListSectionBlock>
  );
};

export default CheckOutListSection;