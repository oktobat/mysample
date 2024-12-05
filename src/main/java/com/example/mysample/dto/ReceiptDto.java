package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class ReceiptDto {
    private long receipt_id;
    private int m_no;
    private int total_amount;
    private Timestamp rc_reg_date;
    private List<Long> g_nos;    // 상품 코드 목록
}
