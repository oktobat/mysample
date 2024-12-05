package com.example.mysample.service;

import com.example.mysample.dto.ReceiptDetailDto;
import com.example.mysample.dto.ReceiptDto;

import java.util.List;

public interface ReceiptService {
    public List<ReceiptDto> myReceiptList(int m_no) throws Exception;
    public int registerReceipt(ReceiptDto receiptDto) throws Exception;
    public List<ReceiptDetailDto> myReceiptDetailList(long receipt_id) throws Exception;
}
