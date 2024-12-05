import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import openDaumPostcode from '@/components/utils/DaumPostcode';

const JoinSectionBlock = styled.div`
  p { text-align:center; margin:20px 0; font-size:18px; 
    span { color:#f00; cursor:pointer }
  }
  .member_form { padding:0 200px 50px;
    label { display:flex; margin-top:40px; align-items:center}
    input {flex:1; margin-left:10px; height:40px; border:none; border-bottom:1px solid #ddd;
      &.red_btn { background:#eb1414; border-radius:3px; vertical-align:center }
    }
    select  { flex:1; height:40px; margin-left:10px;  vertical-align:center; border:none; border-bottom:1px solid #ddd; text-align:center }
    #m_hp1, #m_hp2, #m_hp3 { flex:1; margin-left:0px; text-align:center}
    #m_zipcode { flex:1; margin-left:0; }
    #prof_zipcode { flex:1; }
  }
`

const AdminJoinSection = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    m_email:'',
    m_pw:'',
    m_pw_again:'',
    m_name:'',
    m_gender:'',
    m_hp1:'',
    m_hp2:'',
    m_hp3:'',
    m_zipcode:'',
    m_address:'',
    m_address_sub:''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleJoin = (e)=>{
    e.preventDefault()
    if (form.m_email == "") {
			alert("이메일을 입력해주세요.")
			document.querySelector("#m_email").focus()
			return;
		} else if (form.m_pw == "") {
			alert("비밀번호를 입력해주세요.")
			document.querySelector("#m_pw").focus()
			return;
		} else if (form.m_pw_again == "") {
			alert("비밀번호를 입력해주세요.")
			document.querySelector("#m_pw_again").focus()
			return;
		} else if (form.m_pw != form.m_pw_again){
			alert("비밀번호가 맞지 않습니다.")
			document.querySelector("#m_pw").focus()
			return;
		} else if (form.m_name == "") {
			alert("이름을 입력해주세요.")
			document.querySelector("#m_name").focus()
			return;
		} else if (form.m_hp1 == "" || form.m_hp2 == "" || form.m_hp1 == "") {
			alert("연락처를 입력해주세요.")
			document.querySelector("#m_hp1").focus()
			return;
		}

    axios.post(`${import.meta.env.VITE_API_URL}/admin/joinConfirm`, form)
      .then(res=>{
        alert("회원가입이 완료됐습니다. 승인을 기다려주세요.")
        navigate("/adminLogin")
      })
      .catch(err=>{
        console.log(err)
        alert("회원가입 중 오류가 발생했습니다.");
      })

  }

  const onReset = ()=>{
    setForm({})
  }

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

  return (
    <JoinSectionBlock className="inner">
        <div className="title">
          <h2>관리자 회원가입</h2>
        </div>
        <p>관리자 회원인가요? <span className="change"><Link to="/adminLogin">로그인</Link></span></p>
        <div className="member_form">
          <form onSubmit={ handleJoin }>
              <label>
                이메일: <input type="text" name="m_email" value={form.m_email} onChange={handleChange} />
              </label>
  
              <label>
                비밀번호: <input type="password" id="m_pw" name="m_pw" value={form.m_pw} onChange={handleChange} />
              </label>
  
              <label>비밀번호확인: 
                  <input type="password" id="m_pw_again" name="m_pw_again" value={form.m_pw_again} onChange={handleChange} />
              </label>
  
              <label>이름: 
                  <input type="text" name="m_name" value={form.m_name} onChange={handleChange}/>
              </label>

              <label>성별:
                <select name="m_gender" value={form.m_gender} onChange={handleChange}>
                    <option value="m">남자</option>
                    <option value="w">여자</option>
                </select>
              </label>
  
              <label>핸드폰: 
                  <input type="text" id="m_hp1" name="m_hp1" value={form.m_hp1} onChange={handleChange} />-
                  <input type="text" id="m_hp2" name="m_hp2" value={form.m_hp2} onChange={handleChange} />-
                  <input type="text" id="m_hp3" name="m_hp3" value={form.m_hp3} onChange={handleChange} />
              </label>
  
              <p style={{ display: 'flex', alignItems: 'center', marginTop:'40px' }}>
                  <input 
                      type="text" 
                      id="m_zipcode"
                      name="m_zipcode"
                      value={form.m_zipcode} 
                      onClick={openDaumPostcode} 
                      onChange={handleChange}
                      style={{ marginRight: '0px', flex:'1'}}
                  />
                  <input id="prof_zipcode" type="button" style={{ flex:'1'}} className="red_btn" onClick={openPostcode} value="우편번호 검색" />
              </p>
  
              <input 
                  type="text" 
                  id="m_address"
                  name="m_address"
                  value={form.m_address} 
                  onChange={handleChange}
                  placeholder="기본주소" style={{display:'block', width:'100%', padding:'0', margin:'20px 0'}}
              />
              <input 
                  type="text" 
                  id="m_address_sub"
                  name="m_address_sub"
                  value={form.m_address_sub} 
                  onChange={handleChange} 
                  placeholder="상세주소" style={{display:'block', width:'100%', padding:'0', margin:'20px 0'}}
              />
  
              <p style={{ display:'flex', alignItems:'center', justifyContent:'center', margin:'50px 0' }}>
                  <input type="submit" className="red_btn" value="회원가입" /> 
                  <input type="reset" className="red_btn" value="취소" onClick={ onReset } />
              </p>
          </form>
        </div>
    </JoinSectionBlock>
  );
};

export default AdminJoinSection;