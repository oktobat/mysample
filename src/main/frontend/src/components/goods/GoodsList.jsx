import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCart } from '@/store/goods'
import axios from 'axios'

const UlBlock = styled.ul`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
`
const ListBlock = styled.li`
  border: 0px solid #ddd; margin-bottom:20px;
  .imgbox {
      a  { display:block }
      img { border-radius:30px; width:100% }
   }
  .infobox { padding-top:16px; line-height:2em; text-align:center;
      .name { font-size:15px }
      .price { font-size:20px; color:#eb1414}
      .qty { border:1px solid #000; margin:15px 0; font-size:23px; display:flex; justify-content:space-between; align-items:center;
            button { padding:6px; font-size:23px; flex-shrink: 0;}
            input { border:none; padding:7px 0 4px; text-align:center; flex-grow: 1; min-width:0 }
          }
      .cart {transition:all 0.5s; width:100%; background:#000; color:#fff; padding:15px; border-radius:50px;
          &:hover { opacity:0.7}
          }
      .soldout {transition:all 0.5s; width:100%; background:#f00; color:#fff; padding:15px; border-radius:50px }
      a.goodsModify,
      a.goodsRemove { display:block; padding:6px; background:#ccc; border-radius:50px; margin:5px 0 }
  }
`

const GoodsList = ({goods, fetchList, pageData, title, category, main}) => {
  // const getData = pageData ? pageData : {}
  const dispatch = useDispatch()
  const user = useSelector(state=>state.member.user)
  const [qtys, setQtys] = useState([])
  // qtys = [ 1, 1, ..., 4,.. 1 ]
  

  const onMinus = (ind)=>{
    setQtys(prevQtys => 
      prevQtys.map((value, index) => 
         index==ind && value > 1 ? value-1 : value
      ));
  }

  const onPlus = (inventory, ind)=>{
    setQtys((prevQtys)=>prevQtys.map(
      (value, index) => index==ind && value<inventory ? value+1 : value
    ));
  }

  const onCartIn = (g_no, cart_qty, inventory, ind)=>{
       if (!user) {
         alert("로그인을 한 후 이용하세요.")
         return
       }
       const token = localStorage.getItem('token');
       console.log("유저번호"+user.m_no)
      axios.post(`${import.meta.env.VITE_API_URL}/cart/cartIn`, {g_no, cart_qty, m_no:user.m_no, g_inventory:inventory}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res=>{
        console.log(res.data)
        setQtys((prevQtys)=>prevQtys.map(
          (value, index) => index==ind  ? 1 : value
        ))
        dispatch(fetchCart(user.m_no))
      })
      .catch(err=>{
        console.log(err)
      })
  }

  const onGoodsRemove = async (g_no) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/goods/removeGoods`, {params:{g_no}});
      if (response.data > 0) {
        fetchList(pageData)
        alert("상품이 삭제됐습니다.")
      } else {
        alert('상품 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류로 인해 상품 삭제에 실패했습니다.');
    }
  }

  useEffect(()=>{
    setQtys(goods.map(()=>(1)))
  }, [goods])

  return (
    <UlBlock>
        { goods &&
          goods.map((item, index)=>(
            <ListBlock key={index}>
              <div className="imgbox">
                <Link to={`/goodsDetail/${item.g_no}`} state={{item:item, title, pageData, category}}>
                  <img src={`${import.meta.env.VITE_API_URL}/goodsImg/${item.img_url}`} alt={item.g_name} />
                </Link>
              </div>
              <div className="infobox">
                <p className="name">
                  <Link to={`/goodsDetail/${item.g_no}`} state={{item:item, title, pageData, category}}>{item.g_name}</Link>
                </p>
                <p className="price">{item.g_price.toLocaleString()}원</p>
                <p className="review">
                    <span>☆{item.average_rating.toFixed(1)}</span>
                    <span style={{fontSize:'10px', padding:'0 7px', verticalAlign:'top'}}>|</span>
                    <span>{item.review_count.toLocaleString()}건</span>
                </p>
                <div className="qty">
                    <button className="minus" type="button" onClick={ ()=>onMinus(index) }>-</button>
                    <input type='text' value={qtys[index]} />
                    <button className='plus' type='button' onClick={ ()=>onPlus(item.g_inventory, index) }>＋</button>
                </div>
                {
                    item.g_inventory > 0 ? <button type='button' className='cart' onClick={ ()=>onCartIn(item.g_no, qtys[index], item.g_inventory, index) }>카트에 추가</button> : <button type='button' className='soldout'>품절</button>
                }
                {
                    (user?.m_role=="ROLE_ADMIN"  && !main) &&
                      <>
                         <Link className='goodsModify' to={`/goodsModify/${item.g_no}`} state={{item:item, title, pageData, category}}>상품정보수정</Link> 
                         <a className='goodsRemove' onClick={ (e)=>{e.preventDefault(); onGoodsRemove(item.g_no)}}>상품삭제</a> 
                      </>
                 } 
              </div>
            </ListBlock>
          ))
        }
      </UlBlock>
  );
};

export default GoodsList;