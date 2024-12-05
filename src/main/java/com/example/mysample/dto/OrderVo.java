package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class OrderVo {
    private long order_no;
    private String order_id;
    private int m_no;
    private int order_amount;
    private int shipping_cost;
    private int final_amount;
    private String payment_status;
    private int item_count;
    private String item_name;
    private String receiver_name;
    private String receiver_phone;
    private String shipping_zipcode;
    private String shipping_address;
    private String shipping_status;
    private Timestamp shipped_date;
    private Timestamp order_reg_date;
    private Timestamp order_mod_date;
    private String img_url;
}
