import React, {useEffect, useState} from 'react';
import GoodsCategory from '@/components/goods/GoodsCategory';
import MemberSection from '@/components/member/MemberSection';
import styled from 'styled-components'
import {Link, NavLink, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '@/store/member'
import { initCartCount, fetchCart } from '@/store/goods'
import GoodsSearchForm from '@/components/goods/GoodsSearchForm'


import { FaUserCircle, FaLock, FaShoppingCart, FaHeart, FaChevronDown } from "react-icons/fa";

// NavLink는 클릭을 받으면 .active 클래스가 추가됨

const HeaderBlock = styled.div`
  box-shadow:0px 2px 3px #eee; padding-bottom:15px;
  .row1 { padding:0 50px; height:63px; 
		background:rgb(140, 0, 0); color:#fff;
		display:flex;
		justify-content:space-between; 
		align-items:center; 
    .col1 a { margin-right:15px }
    .col2 { position:relative; border:0px solid #fff; height:35px; width:350px; overflow:hidden;
      p { line-height:35px; text-align:center;  }
    }
    .col3 { position:relative;
      & > a { margin-left:15px; vertical-align:middle; font-size:20px; }	
      .mybox { position:absolute; top:110%; right:0; width:200px; background:#fff; z-index:999; color:#000; padding:10px 20px; display:none;
        &.on { display:block }
        ul li a { display:block; line-height:3em; }
      }
    }
	}
  .row2 { padding:30px 50px; display:flex; justify-content:space-between; align-items:center;  
    div { border:0px solid #000 }
    .col2 { 
      form { width:500px; border:2px solid #eb1414; border-radius:3px;
        display:flex; 
        input { flex:1; border:none; padding:0 2em; outline:none } 
        button { width:46px; height:39px; background:#eb1414; color:#fff; font-size:20px;  }
       }
    }
    .col3 { color:#eb1414; font-size:20px;
      a { margin-left:15px; vertical-align:middle; position:relative;
        span {position:absolute; top:-8px; right:-9px; font-size:12px; width:20px; height:20px; border-radius:50%; background:#fff; color:#eb1414; border:1px solid #eb1414; display:inline-block; text-align:center; vertical-align:middle; transform:translateY(-2px) }
      }
    }
  }
`

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state=>state.member.user)
  const initCount = useSelector(state=>state.goods.cartCount)
  const [type, setType] = useState(null)  // null or 'join' or 'login'
  const [open, setOpen] = useState(false)

  const [cartCount, setCartCount] = useState(initCount)

  const handleLogout = (e)=>{
    e.preventDefault()
    dispatch(userLogout())
    localStorage.clear()
    dispatch(initCartCount(0))
    setOpen(false)
    navigate("/")
  }

  // 로그인 또는 회원가입 버튼 클릭시 호출됨
  const handleClick = (clickType)=> {
    setType(clickType)
  }

  // 주문목록, 나의리뷰관리, .... 로그아웃 메뉴 박스
  const openMyBox = (e)=>{
    e.preventDefault()
    setOpen(!open)
  }
  
  // 토큰 확인 함수
  const checkTokenAndNavigate = (e) => {
    const token = localStorage.getItem('token'); // localStorage에서 토큰 가져오기
    if (token) {
        // 토큰이 있을 경우, 페이지 이동
        setOpen(false);
        navigate("/memberModify");
    } else {
        // 토큰이 없을 경우, 경고 메시지
        e.preventDefault();
        alert("로그인이 필요합니다.");
    }
};


  useEffect(()=>{
    setCartCount(initCount)
  }, [user, initCount])

  return (
    <HeaderBlock>
      <div className="row1">
        <div className="col1">
            <a href="#">About Us</a>
            <a href="/board/customerCenter"><strong>고객센터</strong><span style={{fontSize:'14px'}}>(주문.결제.배송)</span></a>
            { user?.m_role=="ROLE_ADMIN" && <Link to="/goodsRegister">상품등록</Link> }
            { user?.m_role=="ROLE_ADMIN" && <Link to="/goods/uncategory" state={{ title:"미분류"}}>미분류</Link> }
        </div>
        <div className="col2">
           	<p><a href="#">1모바일 앱으로 편리하게 주문하세요. Download</a></p>
           	<p><a href="#">2모바일 앱으로 편리하게 주문하세요. Download</a></p>
        </div>
        <div className="col3">
        {
          !user ? 
            <a
              href="#"
              className="joinBtn"
              onClick={(e) => {
                e.preventDefault();
                handleClick("join");
              }}
            >
              <span className="blind">회원가입</span>
              <FaUserCircle />
            </a>
          : 
          <a href="#" className="openMybox" onClick={openMyBox}>
            <FaLock />
          </a>
        }

        {
          !user ? 
            <a
              href="#"
              className="loginBtn"
              onClick={(e) => {
                e.preventDefault();
                handleClick("login");
              }}
            >
              로그인
            </a>
          : 
          <a href="#" className="openMybox" onClick={openMyBox}>
            {user.m_email}
            <FaChevronDown />
          </a>
        }
            <div className={`mybox ${open ? 'on' : ''}`}>
                <ul>
                    <li><Link to="/myOrderList" onClick={ ()=>setOpen(false)}>나의주문관리</Link></li>
                    {/* <li><Link to="/myReviewList" onClick={ ()=>setOpen(false)}>나의리뷰관리</Link></li> */}
                    <li><Link to="/receiptReview" onClick={ ()=>setOpen(false)}>영수증리뷰쓰기</Link></li>
                    <li><a href="">찜리스트</a></li>
                    <li><a href="#" onClick={  checkTokenAndNavigate}>내정보수정</a></li>
                    <li><a href="#" onClick={ handleLogout }>로그아웃</a></li>
                </ul>
           </div>
        </div>
      </div>
      <div className="row2">
        <div className="col1">
            <h1>
                <Link to="/">
                    <img src="/assets/image/Bitchan.png" alt="빛찬" />
                </Link>
            </h1>
        </div>
        <GoodsSearchForm />
        <div className="col3">
            <NavLink to="좋아요리스트페이지">
                <FaHeart />
            </NavLink>
            <NavLink to="/cartList">
                <FaShoppingCart />
                <span className="cartCount">{cartCount}</span>
            </NavLink>
        </div>
    </div>
    <GoodsCategory />
    <MemberSection type={type} handleClick={ handleClick }  />
    </HeaderBlock>
  );
};

export default Header;