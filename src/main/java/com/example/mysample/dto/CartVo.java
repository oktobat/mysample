package com.example.mysample.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
public class CartVo {

    private long cart_no;
    private long g_no;
    private int m_no;
    private int cart_qty;

    private String g_category;
    private String g_type;
    private String g_name;
    private String g_code;
    private long g_price;
    private int g_inventory;
    private int g_review_count;
    private Timestamp g_reg_date;
    private Timestamp g_mod_date;

    private String img_url;

}
