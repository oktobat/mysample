package com.example.mysample.mapper;

import com.example.mysample.dto.MemberVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface MemberMapper {
    public List<MemberVo> selectMember(String m_email);
    public int insertMember(MemberVo memberVo);
    public int updateMember(MemberVo memberVo);
    public int deleteMember(@Param("m_no") int m_no);

    @Options(useGeneratedKeys = true, keyProperty = "m_no")
    public int insertOauthMember(MemberVo memberVo);
}
