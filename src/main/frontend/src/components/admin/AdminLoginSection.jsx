import React, {useState, useRef } from 'react';
import {useDispatch} from 'react-redux'
import {userLogin } from '@/store/member'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const LoginSectionBlock = styled.div`
  max-width:320px; display:block; margin:100px auto;
  h2 { font-size:40px; text-align:center; margin:0 0 30px}
  p { text-align:center; margin:20px 0; font-size:18px; }
  p span { color:#f00; cursor:pointer }
  label { display:block; margin-top:40px; }
  input { width:100%; height:40px; border:none; border-bottom:1px solid #ddd }
  .findPw { margin-top:40px }
  .findPw a { border-bottom:1px solid #333; line-height:1.5em; color:#333 }
  .btnBox { margin-top:20px; }
  button { height:50px; }
`

const AdminLoginSection = () => {
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
    
    axios.post(`${import.meta.env.VITE_API_URL}/admin/loginConfirm`, { m_email: mEmail, m_pw: mPw })
    .then((res) => {
      console.log("로그인 응답 데이터:", res.data);

      // 로그인 성공
      if (res.data.status === 200 && res.data.token) {
        const { token, loginedMemberVo } = res.data;

        // Redux 상태 업데이트
        dispatch(userLogin({...loginedMemberVo}));

        // JWT 토큰 로컬 스토리지에 저장
        localStorage.setItem("token", token);

        alert("로그인 성공!");
        navigate("/"); // 메인 페이지로 이동
      } else {
        alert(res.data.message || "로그인에 실패했습니다.");
      }
    })
    .catch((err) => {
      if (err.response) {
        const { status, data } = err.response;

        if (status === 403) {
          // 승인 대기 상태
          alert(data.message || "승인 대기 중입니다. 관리자의 승인을 기다려주세요.");
        } else if (status === 401) {
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

      console.error("로그인 에러:", err);
    });
}

  return (
      <LoginSectionBlock>
          <h2>관리자 로그인</h2>
          <p>아직 계정이 없으신가요? <span className="change"><Link to="/adminJoin">가입하기</Link></span></p>
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
    </LoginSectionBlock>
  );
};

export default AdminLoginSection;