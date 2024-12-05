package com.example.mysample.service;

import com.example.mysample.dto.ReceiptDetailDto;
import com.example.mysample.dto.ReceiptDto;
import com.example.mysample.mapper.ReceiptDetailMapper;
import com.example.mysample.mapper.ReceiptMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptMapper receiptMapper;
    private final ReceiptDetailMapper receiptDetailMapper;

    @Override
    public List<ReceiptDto> myReceiptList(int m_no) throws Exception {
        return receiptMapper.selectMyReceipt(m_no);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {RuntimeException.class, IllegalArgumentException.class, Exception.class})
    public int registerReceipt(ReceiptDto receiptDto) throws Exception {
        int result = receiptMapper.insertReceipt(receiptDto);
        if (result>0) {
            result = receiptDetailMapper.insertReceiptDetail(receiptDto);
        }
        return result;
    }

    @Override
    public List<ReceiptDetailDto> myReceiptDetailList(long receipt_id) throws Exception {
        return receiptDetailMapper.selectMyReceiptDetail(receipt_id);
    }
}
