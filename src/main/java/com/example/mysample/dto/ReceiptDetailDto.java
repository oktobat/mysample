package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReceiptDetailDto {
    private long receipt_detail_no;
    private long receipt_id;
    private long g_no;
    private Timestamp rd_reg_date;
    private String reviewed;

    private String g_name;
    private long g_price;
    private String img_url;
}
