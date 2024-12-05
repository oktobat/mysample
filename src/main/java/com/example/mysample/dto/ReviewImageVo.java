package com.example.mysample.dto;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ReviewImageVo {
    private long img_no;
    private int review_no;
    private String img_url;
    private Timestamp img_reg_date;
    private Timestamp img_mod_date;
}
