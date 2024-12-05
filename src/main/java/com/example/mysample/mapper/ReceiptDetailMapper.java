package com.example.mysample.mapper;

import com.example.mysample.dto.ReceiptDetailDto;
import com.example.mysample.dto.ReceiptDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReceiptDetailMapper {
    int insertReceiptDetail(ReceiptDto receiptDto);
    List<ReceiptDetailDto> selectMyReceiptDetail(@Param("receipt_id") long receipt_id);
    int updateReceiptDetailReviewed(@Param("receipt_detail_no") long receiptDetailNo);
}
