import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import axios from 'axios'

const AdminListUpSectionBlock = styled.div`
  .adminList { 
    table { 
      th { border:1px solid #ddd; padding:15px 0;  }
      td { border:1px solid #ddd; padding:10px; text-align:center;
        a { padding:5px 10px; background:#ddd; border-radius:3px}
      }
    }
  }
`

const AdminListUpSection = () => {

  const [adminMembers, setAdminMembers] = useState([])

  const onUpdate = async (m_no)=>{
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/admin/setAdminApproval`, {m_no:m_no})
      if (response.data) {
        fetchAdminList()
      }
    } catch(error) {
      console.error("승인처리를 못했습니다:", error);
    } 
  }

  const fetchAdminList = async () => {
    try {
      const token = localStorage.getItem('token'); 
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/adminMembers`, {
          headers: {
              Authorization: `Bearer ${token}`, // Authorization 헤더에 JWT 추가
          },
      })
      console.log(response.data)
      setAdminMembers(response.data)
    } catch(error) {
      console.error("어드민 리스트를 불러오지 못했습니다:", error);
    } 
  }

  useEffect(()=>{
    fetchAdminList()
  }, [])

  return (
    <AdminListUpSectionBlock className="inner">
        <div className="title">
          <h2>관리자 명단</h2>
        </div>
        <div className="adminList">
          <table>
            <thead>
              <tr>
                <th>계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>가입날짜</th>
                <th>승인</th>
              </tr>
            </thead>
            <tbody>
              {adminMembers?.map((item) => (
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
                    {item.m_approval == 0 ? (
                      <a href="#" onClick={(e)=>{e.preventDefault(); onUpdate(item.m_no)}}>
                        승인처리중
                      </a>
                    ) : (
                      "승인완료"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminListUpSectionBlock>
  );
};

export default AdminListUpSection;