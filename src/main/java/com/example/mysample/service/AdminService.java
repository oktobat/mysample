package com.example.mysample.service;

import com.example.mysample.dto.MemberVo;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

public interface AdminService {
    public int joinConfirm(MemberVo memberVo) throws DataAccessException;
    public Map<String, Object> loginConfirm(MemberVo memberVo) throws DataAccessException;
    public List<MemberVo> adminMembers() throws DataAccessException;
    public List<MemberVo> userMembers() throws DataAccessException;
    public int setAdminApproval(MemberVo memberVo) throws DataAccessException;
    public int setMemberUpgrade(MemberVo memberVo) throws DataAccessException;
}
