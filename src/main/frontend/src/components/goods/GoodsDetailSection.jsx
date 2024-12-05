import React, { useEffect, useState } from 'react';
import {useNavigate, Link} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '@/store/goods'
import axios from 'axios';
import styled from 'styled-components';
import DetailImages from '@/components/goods/DetailImages'
import GoodsReview from '@/components/goods/GoodsReview'

const GoodsDetailSectionBlock = styled.div`
  .prevNext { margin:50px 0; }
  .goods_detail {
      .product {  display:flex;  
          .photo { flex:1.3; 
            img { width:100% }
          }
          .info { flex:1; font-size:20px; line-height:3em; padding-left:50px; 
              .qty { border:1px solid #000; margin:15px 0; font-size:23px; display:flex; justify-content:space-between; align-items:center;
                  button { padding:6px; font-size:23px; flex-shrink: 0;}
                  input { border:none; padding:7px 0 4px; text-align:center; flex-grow: 1; min-width:0 }
              }
              .cart {transition:all 0.5s; width:100%; background:#000; color:#fff; padding:15px; border-radius:50px;
                &:hover { opacity:0.7 }
              }
              .orderBtn {transition:all 0.5s; width:100%; background:#eb1414; color:#fff; padding:15px; border-radius:50px;
                &:hover { opacity:0.7}
              }
          }
      }
      #cartModal {
        position:absolute; top:111%; left:0; 
        width:100%; 
        border:0.4px solid #333;
        padding:20px;
        line-height:2em;
        font-size:15px;
        text-align:center;
        background:#fff;
        &::before {
          content:"";
          width:0px; height:0px;
          border:10px solid #000;
          border-top:none;
          border-left-color:transparent;
          border-right-color:transparent;
          display:block;
          position:absolute;
          top:-10px; 
          left:100px; 
        }
        .btn { margin-top:20px; 
          a { border:1px solid #000; width:150px; }
        }
      }
  }
`

const GoodsDetailSection = ({goodsVo, images, pageData, title, category}) => {
  console.log("category"+category)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state=>state.member.user)
  const [showModal, setShowModal] = useState(false); 
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prevQty) => Math.max(1, prevQty + delta));
  };

  const onCartIn = ()=>{
    if (!user) {
      alert("로그인을 한 후 이용하세요.")
      return
    }
    axios.post(`${import.meta.env.VITE_API_URL}/cart/cartIn`, {g_no:goodsVo.g_no, cart_qty:quantity, m_no:user.m_no, g_inventory:goodsVo.g_inventory})
    .then(res=>{
      console.log(res.data)
      setQuantity(1)
      setShowModal(true);
      setAlreadyInCart(res.data === 2);
      dispatch(fetchCart(user.m_no))
    })
    .catch(err=>{
      console.log(err)
    })
  }


  const baroBuy = () => {
    if (!user){
      alert("로그인을 해야 이용할 수 있습니다.")
      return
    }
    goodsVo.cart_qty = quantity
    const checkOutList = [goodsVo]
    navigate('/checkOutList', { state: { checkOutList } });
  };

  
  return (
    <GoodsDetailSectionBlock>
      <div className="inner">
          <div className="prevNext">
          {category ? (
              <Link to={`/goods/${category === 'search' ? 'search' : pageData.category}`} state={{ title, getData:pageData }}>
                뒤로가기
              </Link>
            ) : (
              <button type="button" onClick={() => navigate(-1)}>
                뒤로가기
              </button>
            )}
          </div>
        <div className="goods_detail">
            <div className="product">
              <div className="photo">
                { goodsVo.img_url ? (
                  <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${goodsVo.img_url}`} alt="상품 이미지" />
                ) : (
                  <img src="/assets/image/Bitchan.png" alt={goodsVo.g_name} />
                )}
              </div>
              <div className="info">
                <table>
                  <tr>
                    <td style={{fontSize:'30px'}} className="gname">{goodsVo.g_name}</td>
                  </tr>
                  <tr>
                    <td><strong style={{color:'#eb1414'}}>{goodsVo.g_price.toLocaleString()}원</strong></td>
                  </tr>
                  <tr>
                    <td className="qty">
                      <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                      <input type="text" readOnly value={quantity} />
                      <button onClick={() => handleQuantityChange(1)} disabled={quantity >= goodsVo.g_inventory}>+</button>
                    </td>
                  </tr>
                  <tr>
                    <td style={{textAlign:'center'}}>합계 : <span className="total">{(goodsVo.g_price * quantity).toLocaleString()}</span>원</td>
                  </tr>
                  { goodsVo.g_inventory>0 &&
                    <tr>
                      <td style={{position:'relative'}}>
                        <button type='button' className='cart' onClick={ onCartIn }>카트에 추가</button>
                        { showModal && 
                          <div id="cartModal">
                            { !alreadyInCart ? 
                              <p>상품을 장바구니에 담았습니다.</p>
                              :
                              <p className="already">이미 담으신 상품이 있습니다.</p> 
                            }
                            <p><strong>장바구니로 이동하시겠습니까?</strong></p>
                            <div className="btn">
                              <a href="javascript:void(0)" id="continueShopping" onClick={ ()=>setShowModal(false)}>계속쇼핑</a>
                              <Link style={{background:'#333', color:'#fff'}} to='/cartList'>장바구니로 이동</Link>
                            </div>
                          </div>
                        }
                      </td>
                    </tr>
                  }
                  <tr>
                    <td>
                      { goodsVo.g_inventory>0 ? 
                        <button type='button' className='orderBtn' onClick={baroBuy}>바로 구매하기</button>
                        :
                        <button type='button' className='orderBtn'>품절</button>
                      }
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <GoodsReview goodsVo={goodsVo} />
            <DetailImages images={images}></DetailImages>
          </div>
      </div>
    </GoodsDetailSectionBlock>
  );
};

export default GoodsDetailSection;