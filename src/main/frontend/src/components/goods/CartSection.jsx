import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { initCartCount } from '@/store/goods'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import styled from 'styled-components'


const CartSectionBlock = styled.div`
  display:flex; align-items:flex-start;
  .cartList { flex:1 }
  .orderList { width:200px; margin-left:20px;
      border:1px solid #ddd; 
      padding:10px; 
    > div { display:flex; 
        justify-content:space-between;
        padding:10px 0; 
    }
    .orderTotalAmount { border-top:1px solid #ddd }
    div.orderBtn { background:#eb1414; color:#fff; 
        padding:20px 0; justify-content:center; 
        cursor:pointer; margin-top:20px }
    .selectOrderGoods { display:flex; flex-wrap:wrap;
        > li { width:33.33%; padding:5px;}
    }	  
  }   

  .cartInfo { text-align:center; margin:20px 0;
    col:nth-child(1) { width:30px; }
    col:nth-child(2) { width:100px; }
    col:nth-child(3) { width:auto; }
    col:nth-child(4) { width:100px; }
    col:nth-child(5) { width:150px; }
    col:nth-child(6) { width:100px; }
    col:nth-child(7) { width:70px; }
    td { text-align:center;  border:1px solid #4c4c4c; } 
    thead { th { padding:15px 0; border:1px solid #4c4c4c; } }
    tbody { 
      button { padding:5px 10px; background:#eb1414; color:#fff; 
        &:disabled { opacity:0.8; }
      }
      input {  text-align:center; margin:3px auto; width:100% }
    }    
    tfoot { td { padding:50px 0; text-align:center; font-size:30px;  } }
  }
  .checkedRemove { text-align:right }
}
`

const CartSection = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(state=>state.member.user)
  const [cartItems, setCartItems] = useState([]);
  const dfee = 3000
  const [selectedItems, setSelectedItems] = useState([]); 
  const token = localStorage.getItem('token');

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/cart/cartList?m_no=${user.m_no}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
      console.log("장바구니리스트"+response.data)
      setCartItems(response.data);
    } catch (error) {
      console.error("장바구니 데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    // 장바구니 데이터 로드
    fetchCartItems();
  }, []);
 

  const cartQtyUpdate = async (cart_no, cart_qty) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/cart/cartUpdate`, { cart_no, cart_qty }, {
        headers: { Authorization: `Bearer ${token}` }
    });
      console.log("장바구니 수량 업데이트"+response.data)
    } catch (error) {
      console.error("장바구니 업데이트 실패:", error);
    }
  };

  const onMinus = (cartNo, cartQty)=>{
    setCartItems(prevData => 
      prevData.map((item) => 
         item.cart_no==cartNo &&  item.cart_qty > 1 ? {...item, cart_qty:item.cart_qty-1} : item
      ));
    cartQtyUpdate(cartNo, cartQty-1)
  }

  const onPlus = (cartNo, inventory, cartQty)=>{
    setCartItems(prevData => 
      prevData.map((item) => 
         item.cart_no==cartNo &&  item.cart_qty < inventory ? {...item, cart_qty:item.cart_qty+1} : item
      ));
    cartQtyUpdate(cartNo, cartQty+1)
  }


  const onRemoveCartItem = (cart_no)=>{
    axios.delete(`${import.meta.env.VITE_API_URL}/cart/cartDelete`, 
    {
      headers: { Authorization: `Bearer ${token}` },
      params : { cart_no:cart_no, m_no:user.m_no }
  }
    )
    .then(res=>{
      console.log("장바구니 아이템 삭제"+res.data)
      setCartItems(prevData =>prevData.filter((item) => item.cart_no !== cart_no));
      dispatch(initCartCount(res.data))
    })
    .catch(err=>console.log(err))
  }

  // 선택 상품 삭제
  const handleRemoveSelectedItems = ()=>{
    if (selectedItems.length==0) {
      alert("선택한 상품이 없습니다.")
      return
    }
    axios.post(`${import.meta.env.VITE_API_URL}/cart/cartCheckedRemove`, { selectedItems, m_no:user.m_no }, 
    {
      headers: { Authorization: `Bearer ${token}` }
  }
    )
    .then(res=>{
      console.log("장바구니 선택상품 삭제"+res.data)
      dispatch(initCartCount(res.data))
      setCartItems(prevCartItems =>
        prevCartItems.filter(item => !selectedItems.includes(item.cart_no))
      );
      setSelectedItems([]); 
    })
    .catch (error=>{
      console.log("장바구니 선택상품 삭제 실패:", error);
    }) 

  }

  const handleAllCheck = (e) => { 
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedItems(cartItems.map(item => item.cart_no));
    } else {
      setSelectedItems([]);
    }
  }

  // 개별 선택 / 해제
  const handleItemCheck = (cart_no) => {
    setSelectedItems(prevSelectedItems =>
      prevSelectedItems.includes(cart_no)
        ? prevSelectedItems.filter(id => id !== cart_no) // 이미 선택된 항목은 해제
        : [...prevSelectedItems, cart_no] // 새로 선택된 항목 추가
    );
  };

  const selectedItemsHTML = selectedItems.length > 0 ? selectedItems.map(cart_no => {
    const foundItem = cartItems.find(value => value.cart_no === cart_no);
    return foundItem !==-1 && (
      <li key={foundItem.cart_no}>
        <img 
          src={`${import.meta.env.VITE_API_URL}/goodsImg/${foundItem.img_url}`} 
          alt={foundItem?.g_name} 
        />
      </li>
    );
  }) : null;

  // 선택상품의 주문금액 합계
  const selectedAmount = () => {
    return selectedItems.reduce((total, cart_no) => {
        const finditem = cartItems.find(item => item.cart_no === cart_no);
        return finditem!=-1 ? total + (finditem.g_price * finditem.cart_qty) : total;
    }, 0);
  }

  // 전체상품 주문금액
  const orderAmount = () => {
    return cartItems.reduce((total, item) => total + (item.g_price * item.cart_qty), 0);
  };

  // 주문하기
  const handleOrderClick = () => {
    const checkOutList = selectedItems.length > 0
    ? cartItems.filter(item => selectedItems.includes(item.cart_no))
    : cartItems;
    navigate('/checkOutList', { state: { checkOutList } });
  };

  return (
    <div className="inner">
        <div className="title">
          <h2>장바구니</h2>
        </div>
        { cartItems.length>0 ?
        <CartSectionBlock>
          <div className="cartList">
            <div className="checkedRemove"><button type="button" onClick={handleRemoveSelectedItems}>선택상품삭제</button></div> 
            <table className="cartInfo">
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
                    <th>
                      <input 
                      className="allCheck" 
                      type="checkbox" 
                      onChange={handleAllCheck} 
                      checked={selectedItems.length === cartItems.length && cartItems.length > 0}
                      />
                    </th>
                    <th>이미지</th>
                    <th>상품명</th>
                    <th>판매가</th>
                    <th>수량</th>
                    <th>합계</th>
                    <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                { cartItems==null && 
                  <tr>
                    <td colspan="7" style={{padding:'100px 0', fontSize:'50px'}}>장바구니가 비어 있습니다.</td>
                  </tr>
                }
                {
                  cartItems.map((item, index)=>(
                      <tr key={index}>
                        <td><input type="checkbox" checked={ selectedItems.includes(item.cart_no) } onChange={() => handleItemCheck(item.cart_no)}  /></td>
                        <td>
                          <Link to={`/goodsDetail/${item.g_no}`} state={{item:item }}>
                            { item.img_url != null ?
                              <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} />
                              :
                              <img src="/assets/image/Bitchan.png" alt={item.g_name} />
                            }
                          </Link>
                        </td>
                        <td>
                          <Link to={`/goodsDetail/${item.g_no}`} state={{item:item }}>{item.g_name}</Link>
                          { item.g_inventory==0 && <span style={{ padding:'2px 5px', background:'#f00', color:'#fff', borderRadius:'3px' }}>품절</span> }
                        </td>
                        <td>
                          {item.g_price.toLocaleString()}원
                        </td>
                        <td className="allTot">
                          <button type="button" className="plus" onClick={ ()=>onPlus(item.cart_no, item.g_inventory, item.cart_qty) }>+</button>
                          <input type="text" style={{width:'50px'}} value={item.cart_qty } />
                          <button type="button" className="minus" onClick={()=>onMinus(item.cart_no, item.cart_qty) }>-</button>
                        </td>
                        <td>
                          { (item.g_price * item.cart_qty).toLocaleString() }원
                        </td>
                        <td>
                          <button type="button" className="remove" onClick={()=>onRemoveCartItem(item.cart_no) }>삭제</button>
                        </td>
                      </tr>
                  ))
                }
              </tbody>
              {
                cartItems.length > 0 &&
                <tfoot>
                  <tr>
                    <td colSpan="7">
                      <span className="total">
                        { selectedItems.length > 0 ? 
                          (selectedAmount()).toLocaleString()
                          :
                          (orderAmount()).toLocaleString()
                        }원
                      </span>
                      +
                      <span className="dfee">{dfee.toLocaleString()}원(배송비)</span>
                      =
                      <span className="all_total">
                       { selectedItems.length > 0 ? 
                          (selectedAmount()+dfee).toLocaleString() 
                          :
                          (orderAmount()+dfee).toLocaleString()
                        }원
                      </span>
                    </td>
                  </tr>
                </tfoot>
              }
            </table>
          </div>
          <div className="orderList">
            <div className="orderCount">
            {selectedItems.length > 0 
              ? `선택상품 : ${selectedItems.length}개` 
              : `전체상품 : ${cartItems ? cartItems.length : 0}개`}
            </div>
            <div className="orderGoods">
              <ul className="selectOrderGoods">
                { selectedItemsHTML }
              </ul>
            </div>
            <div className="orderAmount">주문금액 : 
              <span>
                {selectedItems.length > 0 ? 
                (selectedAmount()).toLocaleString() 
                : 
                (orderAmount()).toLocaleString()}원
              </span>
            </div>
            <div className="orderAFee">배송비 : <span>{dfee.toLocaleString()}원</span></div>
            <div className="orderTotalAmount">결제예정금액 : 
              <span>
              { selectedItems.length > 0 ? 
                (selectedAmount()+dfee).toLocaleString() 
                          :
                (orderAmount()+dfee).toLocaleString()
              }원
              </span>
            </div>
            <div className="orderBtn" onClick={handleOrderClick}>주문하기</div>
          </div>
        </CartSectionBlock>
        :
        <CartSectionBlock style={{ fontSize:'30px', justifyContent:'center', margin:'100px 0'}}>장바구니가 비었습니다.</CartSectionBlock>
      }
    </div>
  );
};

export default CartSection;