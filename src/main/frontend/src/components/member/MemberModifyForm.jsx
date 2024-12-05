import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import { userLogin, userLogout } from '@/store/member'
import styled from 'styled-components'
import openDaumPostcode from '@/components/utils/DaumPostcode';
import axios from 'axios'

const MemberModifyFormBlock = styled.div`
  .modify_member_form { padding:0 200px 50px;
    input { padding:5px; width:100%; height:40px; margin:5px 0; vertical-align:center; 
      &.red_btn { background:#8c0000; width:100px; border-radius:3px; vertical-align:center }
    }
    select  { width:100%; height:40px; margin:5px 0; vertical-align:center }
    #m_hp1, #m_hp2, #m_hp3 { width:165px; padding:5px }
    #m_zipcode { width:100px; padding:5px }
    #prof_zipcode { width:100px; padding:5px }
  }
`

const MemberModifyForm = ({memberVo}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    m_no:memberVo.m_no,
    m_email:memberVo.m_email,
    m_pw:'',
    m_pw_again:'',
    m_name:memberVo.m_name,
    m_gender:memberVo.m_gender,
    m_hp1:memberVo.m_hp1,
    m_hp2:memberVo.m_hp2,
    m_hp3:memberVo.m_hp3,
    m_zipcode:memberVo.m_zipcode,
    m_address:memberVo.m_address,
    m_address_sub:memberVo.m_address_sub
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleModify = (e)=>{
    e.preventDefault()
    if (form.m_pw == "") {
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
		}
    axios.put(`${import.meta.env.VITE_API_URL}/member/modifyMemberConfirm`, form)
      .then(res=>{
        alert("회원정보가 수정됐습니다.")
        dispatch(userLogin(res.data))
        navigate("/")
      })
      .catch(err=>{
        console.log(err)
        alert("회원정보 수정 중 오류가 발생했습니다.");
      })

  }

  const onReset = ()=>{
    setForm({})
  }

  const onRemove = (e)=>{
    e.preventDefault()
    const answer = confirm("정말로 탈퇴하시겠습니까?")
    if (!answer) {
      return 
    }
    axios.delete(`${import.meta.env.VITE_API_URL}/member/removeMemberConfirm`, {params:{ m_no:form.m_no}})
      .then(res=>{
        alert("탈퇴 완료됐습니다.")
        dispatch(userLogout())
        navigate("/")
      })
      .catch(err=>{
        console.log(err)
        alert("회원탈퇴 중 오류가 발생했습니다.");
      })
  }

  return (
    <MemberModifyFormBlock className="inner">
      <div className="title">
        <h2>회원정보수정</h2>
      </div>
      <div className="modify_member_form">
            <form onSubmit={ handleModify }>
                <input type="hidden" name="m_no" value={form.m_no} />
                <input type="hidden" name="m_email" value={form.m_email} />

                <label>
                  이메일: <input type="text" value={form.m_email} disabled />
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

                <select name="m_gender" value={form.m_gender} onChange={handleChange}>
                    <option value="">성별</option>
                    <option value="m">남자</option>
                    <option value="w">여자</option>
                </select>

                <label>핸드폰: 
                    <input type="text" id="m_hp1" name="m_hp1" value={form.m_hp1} onChange={handleChange} />-
                    <input type="text" id="m_hp2" name="m_hp2" value={form.m_hp2} onChange={handleChange} />-
                    <input type="text" id="m_hp3" name="m_hp3" value={form.m_hp3} onChange={handleChange} />
                </label>

                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        id="m_zipcode"
                        name="m_zipcode"
                        value={form.m_zipcode} 
                        onClick={openDaumPostcode} 
                        onChange={handleChange}
                        style={{ marginRight: '5px' }}
                    />
                    <input id="prof_zipcode" type="button" className="red_btn" onClick={openDaumPostcode} value="우편번호 검색" />
                </p>

                <input 
                    type="text" 
                    id="m_address"
                    name="m_address"
                    value={form.m_address} 
                    onChange={handleChange}
                    placeholder="기본주소" 
                />
                <input 
                    type="text" 
                    id="m_address_sub"
                    name="m_address_sub"
                    value={form.m_address_sub} 
                    onChange={handleChange}
                    placeholder="상세주소" 
                />

                <p style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <input type="submit" className="red_btn" value="정보수정" /> 
                    <input type="reset" className="red_btn" value="reset" onClick={ onReset } style={{ margin:'20px 10px'}} />
                    <input type="button" className="red_btn" value="회원탈퇴" onClick={onRemove} />
                </p>
            </form>
        </div>
    </MemberModifyFormBlock>
  );
};

export default MemberModifyForm;