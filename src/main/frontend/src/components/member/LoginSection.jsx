import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import SnsLogin from '@/components/member/SnsLogin'
import {useDispatch} from 'react-redux'
import {userLogin } from '@/store/member'
import { fetchCart } from '@/store/goods'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const LoginSectionBlock = styled.div`
  width:320px; display:block;
  h2 { font-size:48px; text-align:center; margin:0 0 30px}
  p { text-align:center; margin:20px 0; font-size:18px; }
  p span { color:#f00; cursor:pointer }
  label { display:block; margin-top:40px; }
  input { width:100%; height:40px; border:none; border-bottom:1px solid #ddd }
  .findPw { margin-top:40px }
  .findPw a { border-bottom:1px solid #333; line-height:1.5em; color:#333 }
  .btnBox { margin-top:20px; }
  button { height:50px; }
`

const LoginSection = ({handleClick}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [mEmail, setMemail] = useState("")
  const [mPw, setMpw] = useState("")

  const mEmailRef = useRef("")
  const mPwRef = useRef("")

  const handleLogin = (e)=>{
    e.preventDefault()
    if (!mEmail) {
        alert("이메일을 입력하세요.")
        mEmailRef.current.focus()
        return
    }
    if (!mPw) {
        alert("비밀번호를 입력하세요.")
        mPwRef.current.focus()
        return
    }
    
    axios.get(`${import.meta.env.VITE_API_URL}/member/loginConfirm`, {params:{ m_email:mEmail, m_pw:mPw }})
    .then((res)=>{
      if (res.data.status === 200 && res.data.token) {
        const { token, loginedMemberVo } = res.data;
        dispatch(userLogin({...loginedMemberVo}))
        localStorage.setItem('token', token);
        dispatch(fetchCart(loginedMemberVo.m_no))
        setMemail("")
        setMpw("")
        handleClick(null)
        navigate("/")
      } else {
        alert(res.data.message || "로그인에 실패했습니다.");
      }
    })
    .catch((err) => {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 401) {
          // 인증 오류
          alert(data.message || "아이디 또는 비밀번호가 잘못되었습니다.");
        } else {
          // 기타 서버 오류
          alert(`오류(${status}): 서버에서 처리할 수 없습니다.`);
        }
      } else {
        // 네트워크 에러 또는 기타 오류
        alert("오류가 발생했습니다. 인터넷 연결을 확인하거나 잠시 후 다시 시도해주세요.");
      }
    });
  }

  return (
    <LoginSectionBlock>
          <h2>로그인</h2>
          <p>아직 계정이 없으신가요? <span className="change" onClick={()=>handleClick('join')}>가입하기</span></p>
          <form onSubmit={handleLogin}>
              <div>
                  <label htmlFor="lm_email">이메일</label>
                  <input ref={mEmailRef} type="text" name="m_email" id="lm_email" value={mEmail} onChange={ (e)=>setMemail(e.target.value)} />
                  <label htmlFor="lm_pw">비밀번호</label>
                  <input ref={mPwRef} type="password" name="m_pw" id="lm_pw" value={mPw} onChange={ (e)=>setMpw(e.target.value)} />
              </div>
              <div className="findPw">
                <a href="#">비밀번호 찾기</a>
              </div>
              <div className="btnBox">
                <button type="submit" className="red_btn">로그인</button>
              </div>
          </form>
          <SnsLogin />
     </LoginSectionBlock>
  );
};

export default LoginSection;