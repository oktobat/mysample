package com.example.mysample.service;

import com.example.mysample.dto.MemberVo;
import com.example.mysample.mapper.AdminMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final PasswordEncoder passwordEncoder;
    private final AdminMapper adminMapper;

    @Override
    public int joinConfirm(MemberVo memberVo) throws DataAccessException {
        String password = passwordEncoder.encode(memberVo.getM_pw());
        memberVo.setM_pw(password);
        return adminMapper.insertMember(memberVo);
    }

    @Override
    public Map<String, Object> loginConfirm(MemberVo memberVo) throws DataAccessException {
        Map<String, Object> map = new HashMap<>();
        List<MemberVo> findMembers = adminMapper.selectMember(memberVo);
        if (!findMembers.isEmpty()) { // 계정이 존재하는 경우
            MemberVo foundMember = findMembers.get(0);
            if (passwordEncoder.matches(memberVo.getM_pw(), foundMember.getM_pw())) {
                if (foundMember.getM_role().equals("ROLE_ADMIN")) {
                    map.put("loginedMemberVo", foundMember);
                    map.put("message", "로그인 성공");
                } else {
                    map.put("loginedMemberVo", null);
                    map.put("message", "관리자회원이 아닙니다.");
                }
            } else {
                map.put("loginedMemberVo", null);
                map.put("message", "비밀번호가 틀렸습니다.");
            }
        } else { // 계정이 존재하지 않는 경우
            map.put("loginedMemberVo", null);
            map.put("message", "계정이 존재하지 않습니다.");
        }
        return map;
    }

    @Override
    public List<MemberVo> adminMembers() throws DataAccessException {
        return adminMapper.selectAllMember();
    }

    @Override
    public List<MemberVo> userMembers() throws DataAccessException {
        return adminMapper.selectUserMember();
    }

    @Override
    public int setAdminApproval(MemberVo memberVo) throws DataAccessException {
        return adminMapper.updateAdminApproval(memberVo);
    }

    @Override
    public int setMemberUpgrade(MemberVo memberVo) throws DataAccessException {
        return adminMapper.updateMemberUpgrade(memberVo);
    }


}
