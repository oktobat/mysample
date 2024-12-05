import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

const MemberListUpSectionBlock = styled.div`
.memberList { 
  table { 
    th { border:1px solid #ddd; padding:15px 0;  }
    td { border:1px solid #ddd; padding:10px; text-align:center;
      a { padding:5px 10px; background:#ddd; border-radius:3px}
    }
  }
}
`

const MemberListUpSection = () => {

  const [members, setMembers] = useState([])
  const token = localStorage.getItem('token'); 

  const onUpdate = async (m_no)=>{
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/admin/setMemberUpgrade`, {m_no:m_no}, {
                        headers: {
                            Authorization: `Bearer ${token}`, 
                        },
                      })
      if (response.data) {
        fetchMemberList()
      }
    } catch(error) {
      console.error("관리자 전환을 못했습니다:", error);
    } 
  }

  const fetchMemberList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/userMembers`, {
          headers: {
              Authorization: `Bearer ${token}`, 
          },
      })
      console.log(response.data)
      setMembers(response.data)
    } catch(error) {
      console.error("어드민 리스트를 불러오지 못했습니다:", error);
    } 
  }

  useEffect(()=>{
    fetchMemberList()
  }, [])

  return (
    <MemberListUpSectionBlock className="inner">
        <div className="title">
          <h2>회원 명단</h2>
        </div>
        <div className="memberList">
          <table>
            <thead>
              <tr>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>가입날짜</th>
                <th>관리자전환</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((item) => (
                <tr key={item.m_no}>
                  <td>{item.m_email}</td>
                  <td>{item.m_name}</td>
                  <td>
                    {item.m_hp1}-{item.m_hp2}-{item.m_hp3}
                  </td>
                  <td>
                    {new Date(item.m_reg_date).toLocaleDateString()}
                  </td>
                  <td>
                    {item.m_role == "ROLE_MEMBER" ? (
                      <a href="#" onClick={(e)=>{e.preventDefault(); onUpdate(item.m_no)}}>
                        관리자회원변경
                      </a>
                    ) : (
                      "관리자"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MemberListUpSectionBlock>
  );
};

export default MemberListUpSection;