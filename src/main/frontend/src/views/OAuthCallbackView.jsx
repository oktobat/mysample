import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {fetchCart} from '@/store/goods'
import {userLogin} from '@/store/member'
import axios from 'axios'

const OAuthCallbackView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { provider } = useParams()
  const query = new URLSearchParams(useLocation().search);
  const code = query.get('code');

  console.log(code)

  useEffect(() => {
    const loginWithCode = async () => {
      if (code) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/oauth/${provider}`, { code }, {
            headers: { 'Content-Type': 'application/json' },
          });
          console.log("너니", res.data);
          const { token, loginedMemberVo } = res.data;
          dispatch(userLogin({ ...loginedMemberVo }));
          localStorage.setItem('token', token);
          dispatch(fetchCart(loginedMemberVo.m_no));
          navigate("/");
        } catch (error) {
          console.error("OAuth 처리 중 오류 발생:", error);
        }
      }
    };
  
    loginWithCode();
  }, [code, dispatch, navigate]);

  return <div className="inner" style={{ fontSize:'30px', textAlign:"center", margin:'50px'}}>Processing...</div>;
};

export default OAuthCallbackView;