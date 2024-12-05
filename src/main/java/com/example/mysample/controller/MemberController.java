package com.example.mysample.controller;

import com.example.mysample.dto.MemberVo;
import com.example.mysample.service.MemberService;
import com.example.mysample.util.JwtUtil;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/member")
public class MemberController {

    private final JwtUtil jwtUtil;
    private final MemberService memberService;

    @GetMapping("/loginConfirm")
    public ResponseEntity<Map<String, Object>> loginConfirm(@RequestParam("m_email") String m_email, @RequestParam("m_pw") String m_pw) {
        log.info("멤버 로그인 시도: {}", m_email);
        Map<String, Object> map  = memberService.loginConfirm(m_email, m_pw);
        MemberVo loginedMember = (MemberVo) map.get("loginedMemberVo");
        String message = (String) map.get("message");

        if (loginedMember != null) {
            String token = jwtUtil.generateToken(loginedMember.getM_email(), loginedMember.getM_role(), loginedMember.getM_approval());
            log.info("JWT 생성: {}", token);
            map.put("token", token);
            map.put("status", HttpStatus.OK.value());
            return ResponseEntity.ok(map);
        } else {
            log.warn("로그인 실패: {}", message);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", message,
                            "status", HttpStatus.UNAUTHORIZED.value()
                    ));
        }
    }

    @PostMapping("/joinConfirm")
    public ResponseEntity<Integer> joinConfirm(@RequestBody MemberVo memberVo, HttpSession session) {
        System.out.println("왔니");
        int result = memberService.joinConfirm(memberVo);
        System.out.println("result"+result);
        session.invalidate();
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @PutMapping("/modifyMemberConfirm")
    public ResponseEntity modifyMemberConfirm(@RequestBody MemberVo memberVo) {
        int result = memberService.modifyMemberConfirm(memberVo);
        if (result>0) {
            return ResponseEntity.ok(memberVo);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }

    @DeleteMapping("/removeMemberConfirm")
    public ResponseEntity removeMemberConfirm(@RequestParam("m_no") int m_no) {
        int result = memberService.removeMemberConfirm(m_no);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }


}
