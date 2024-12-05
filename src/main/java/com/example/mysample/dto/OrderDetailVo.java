package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class OrderDetailVo {
    private long order_detail_no;
    private long order_no;
    private long g_no;
    private int order_qty;
    private String g_name;
    private long g_price;
    private String img_url;
    private Timestamp od_reg_date;
    private Timestamp od_mod_date;
    private String reviewed;
}
