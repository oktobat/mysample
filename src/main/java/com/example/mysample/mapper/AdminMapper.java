package com.example.mysample.mapper;

import com.example.mysample.dto.MemberVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminMapper {
    public int insertMember(MemberVo memberVo);
    public List<MemberVo> selectMember(MemberVo memberVo);
    public List<MemberVo> selectAllMember();
    public List<MemberVo> selectUserMember();
    public int updateAdminApproval(MemberVo memberVo);
    public int updateMemberUpgrade(MemberVo memberVo);
}
