package com.example.mysample.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
public class GoodsImageVo {
    private long img_no;
    private long g_no;
    private String img_url;
    private Timestamp img_reg_date;
    private Timestamp img_mod_date;
}
