package com.example.mysample.service;

import com.example.mysample.dto.MemberVo;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

public interface MemberService {
    public Map<String, Object> loginConfirm(String m_email, String m_pw) throws DataAccessException;
    public MemberVo oauthMember(String m_email) throws DataAccessException;
    public int joinConfirm(MemberVo memberVo) throws DataAccessException;
    public int oauthRegisterConfirm(MemberVo memberVo) throws DataAccessException;
    public int modifyMemberConfirm(MemberVo memberVo) throws DataAccessException;
    public int removeMemberConfirm(int m_no) throws DataAccessException;
}
