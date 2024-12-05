import React from 'react';
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const ReceiptListBlock = styled.table`
  margin:30px 0; 
  th, td { border:1px solid #ddd; padding:7px; 
    font-weight:normal }
`

const ReceiptList = ({myReceiptList}) => {
  return (
    <ReceiptListBlock>
      <tr>
        <th>영수증 ID</th>
        <th>결제금액</th>
        <th>업로드날짜</th>
        <th>상세내역</th>
      </tr>
      {
        myReceiptList.map(item=>(
          <tr key={item.receipt_id}>
            <td>{item.receipt_id}</td>
            <td>{item.total_amount}</td>
            <td>{new Date(item.rc_reg_date).toLocaleDateString()}</td>
            <td><Link to={`/receiptDetail/${item.receipt_id}`}>영수증상세내역</Link></td>
          </tr>
        ))
      }
    </ReceiptListBlock>
  );
};

export default ReceiptList;