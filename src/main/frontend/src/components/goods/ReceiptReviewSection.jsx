import React, {useRef, useState, useEffect} from 'react';
import {useSelector } from 'react-redux';
import ReceiptList from '@/components/goods/ReceiptList'
import axios from 'axios'
import styled from 'styled-components'

const ReceiptReviewSectionBlock = styled.div`
  text-align:center;
  p { margin:10px 0 }
  .file { width:300px; border:1px solid #ddd }
  .btn1, .btn2 { background:#eb1414; color:#fff; 
    cursor:pointer; margin:0 5px; padding:4px 10px; 
    border-radius:3px }
`

const ReceiptReviewSection = () => {
  const user = useSelector(state=>state.member.user)
  const fileInputRef = useRef(null); // ref 생성
  const [file, setFile] = useState();
  const [myReceiptList, setMyReceiptList] = useState([])

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onRegisterReceipt = async (e)=>{
    e.preventDefault()

    if (!file) {
      alert("영수증 이미지를 선택하세요.")
      return
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("m_no", user.m_no);

    // 파이썬 서버로 영수증 이미지 파일 보내기
    try {
      const response = await axios.post(`${import.meta.env.VITE_PYTHON_API_URL}/upload`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      alert(response.data.message);
      if (response.data.message == "등록 성공") {
        fetchReceiptList()
        setFile([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null; // 파일 입력 필드 초기화
        }
      }
    } catch(error){
      console.error("업로드 중 에러 발생:", error);
      alert("업로드 실패!");
    }

  }

  const fetchReceiptList = async ()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/receipt/myReceiptList?m_no=${user.m_no}`);
      console.log("영수증리스트"+response.data)
      setMyReceiptList(response.data);
    } catch (error) {
      console.error("영수증리스트 로드 실패:", error);
    }
  }

  useEffect(()=>{
    fetchReceiptList()
  }, [user])

  return (
    <ReceiptReviewSectionBlock className="inner">
        <div className="title">
          <h2>영수증 리뷰쓰기</h2>
        </div>
        <form onSubmit={onRegisterReceipt}>
          <p>영수증을 업로드 하세요.</p>
          <input type="file" className="file" ref={fileInputRef} onChange={handleFileChange} />
          <input type="submit" className="btn1" value="등록" />
          <input type="reset" className="btn2" value="취소" />
        </form>
        <ReceiptList myReceiptList={myReceiptList} />
    </ReceiptReviewSectionBlock>
  );
};

export default ReceiptReviewSection;