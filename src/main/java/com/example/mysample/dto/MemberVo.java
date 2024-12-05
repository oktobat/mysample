package com.example.mysample.dto;

import lombok.*;

import java.sql.Timestamp;

@Data
public class MemberVo {
    private int m_no;
    private String m_email;
    private String m_pw;
    private String m_name;
    private String m_gender;
    private String m_hp1;
    private String m_hp2;
    private String m_hp3;
    private String m_zipcode;
    private String m_address;
    private String m_address_sub;
    private Timestamp m_reg_date;
    private Timestamp m_mod_date;
    private String m_googleId;
    private String m_kakaoId;
    private LoginType m_loginType;
    private String m_role;
    private int m_approval;
}
