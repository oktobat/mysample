package com.example.mysample.dto;

import lombok.*;

import java.sql.Timestamp;

@Data
public class GoodsDto {
    private long g_no;
    private String g_category;
    private String g_type;
    private String g_name;
    private String g_code;
    private long g_price;
    private int g_inventory;
    private Timestamp g_reg_date;
    private Timestamp g_mod_date;

    private long img_no;
    private String img_url;
    private Timestamp img_reg_date;
    private Timestamp img_mod_date;
    private int review_count;
    private float average_rating;
}
