package com.example.mysample.service;

import com.example.mysample.dto.MemberVo;
import com.example.mysample.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final PasswordEncoder passwordEncoder;

    private final MemberMapper memberMapper;

    @Override
    public Map<String, Object> loginConfirm(String m_email, String m_pw) throws DataAccessException {
        Map<String, Object> map = new HashMap<>();
        List<MemberVo> findMembers = memberMapper.selectMember(m_email);
        if (findMembers.size()>0) {
            System.out.println("비밀번호"+findMembers.get(0).getM_pw());
            if (passwordEncoder.matches(m_pw, findMembers.get(0).getM_pw() )) {
                map.put("loginedMemberVo", findMembers.get(0));
            } else {
                map.put("loginedMemberVo", null);
                map.put("message", "비밀번호가 틀립니다.");
            }
        } else {
            map.put("loginedMemberVo", null);
            map.put("message", "계정이 존재하지 않습니다.");
        }
        return map;

    }

    @Override
    public MemberVo oauthMember(String m_email) throws DataAccessException {
        List<MemberVo> members = memberMapper.selectMember(m_email);
        return members.isEmpty() ? null : members.get(0);
    }

    @Override
    public int joinConfirm(MemberVo memberVo) throws DataAccessException {
        String password = passwordEncoder.encode(memberVo.getM_pw());
        memberVo.setM_pw(password);
        return memberMapper.insertMember(memberVo);
    }

    @Override
    public int oauthRegisterConfirm(MemberVo memberVo) throws DataAccessException {
        memberMapper.insertOauthMember(memberVo);
        return memberVo.getM_no();
    }

    @Override
    public int modifyMemberConfirm(MemberVo memberVo) throws DataAccessException {
        String password = passwordEncoder.encode(memberVo.getM_pw());
        memberVo.setM_pw(password);
        return memberMapper.updateMember(memberVo);
    }

    @Override
    public int removeMemberConfirm(int m_no) throws DataAccessException {
        return memberMapper.deleteMember(m_no);
    }
}
