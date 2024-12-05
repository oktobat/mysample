package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReviewVo {
    private int review_no;
    private String comment;
    private int rating;
    private long g_no;
    private Long order_detail_no;
    private Long receipt_detail_no;
    private int m_no;
    private Timestamp rv_reg_date;
    private Timestamp rv_mod_date;

    private long img_no;
    private String img_url;
    private String m_email;
    private String g_name;
    private String images;
}
