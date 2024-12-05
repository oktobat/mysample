import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom"
import axios from 'axios'
import ReceiptDetailSection from '@/components/goods/ReceiptDetailSection'

const ReceiptDetailView = () => {
  const { rid } = useParams()
  const [receiptDetailList, setReceiptDetailList] = useState([])
  const fetchReceiptDetailList = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/receipt/myReceiptDetailList`, {params:{receipt_id:rid }});
      console.log("영수증상세리스트"+response.data)
      setReceiptDetailList(response.data)
    } catch (error) {
      console.error("영수증상세리스트 로드 실패:", error);
    }
  };

  useEffect(() => {
    // 영수증상세 리스트 로드
    fetchReceiptDetailList();
  }, []);

  return (
    <ReceiptDetailSection receiptDetailList={receiptDetailList}  />
  );
};

export default ReceiptDetailView;