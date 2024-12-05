import React, {useState, useRef} from 'react';
import styled from 'styled-components'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const JoinSectionBlock = styled.div`
  width:320px; display:block; 
  h2 { font-size:48px; text-align:center; margin:0 0 30px}
  p { text-align:center; margin:20px 0; font-size:18px; }
  p span { color:#f00; cursor:pointer }
  label { display:block; margin-top:40px; }
  input { width:100%; height:40px; border:none; border-bottom:1px solid #ddd }
  .btnBox { margin-top:20px; }
  button { height:50px; }
`

const JoinSection = ({handleClick}) => {
  const navigate = useNavigate();
  const [mEmail, setMemail] = useState("")
  const [mPw, setMpw] = useState("")

  const mEmailRef = useRef("")
  const mPwRef = useRef("")

  const handleJoin = (e)=>{
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
    
    axios.post(`${import.meta.env.VITE_API_URL}/member/joinConfirm`, { m_email:mEmail, m_pw:mPw })
    .then((res)=>{
      console.log(res)
      handleClick(null)  // 멤버섹션 모달박스 닫기
      navigate("/")
    })
    .catch(err=>{
      if (err.response && err.response.status === 401) {
        alert("다시 시도해주세요.");
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
      console.error("회원가입 에러:", err);
    })
  }

  return (
    <JoinSectionBlock>
        <h2>회원가입</h2>
        <p>아직 계정이 없으신가요? <span className="change" onClick={()=>handleClick('login')}>로그인</span></p>
        <form onSubmit={handleJoin}>
          <div>
            <label htmlFor="m_email">이메일</label>
            <input ref={mEmailRef} type="text" name="m_email" id="lm_email" value={mEmail} onChange={ (e)=>setMemail(e.target.value)} />
            <label htmlFor="m_pw">비밀번호</label>
            <input ref={mPwRef} type="password" name="m_pw" id="lm_pw" value={mPw} onChange={ (e)=>setMpw(e.target.value)} />
          </div>
          <div className="btnBox">
            <button type="submit" className="red_btn">회원가입</button>
          </div>
        </form>
    </JoinSectionBlock>
  );
};

export default JoinSection;