package com.example.mysample.mapper;

import com.example.mysample.dto.ReceiptDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReceiptMapper {
    List<ReceiptDto> selectMyReceipt(@Param("m_no") int m_no);
    int insertReceipt(ReceiptDto receiptDto);
}
