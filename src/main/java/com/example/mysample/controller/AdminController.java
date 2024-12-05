package com.example.mysample.controller;

import com.example.mysample.dto.MemberVo;
import com.example.mysample.service.AdminService;
import com.example.mysample.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/admin")
public class AdminController {

    private final JwtUtil jwtUtil;
    private final AdminService adminService;

    @PostMapping("/loginConfirm")
    public ResponseEntity<?> loginConfirm(@RequestBody MemberVo memberVo) {
        log.info("관리자 로그인 시도: {}", memberVo);
        Map<String, Object> map = adminService.loginConfirm(memberVo);
        MemberVo loginedMember = (MemberVo) map.get("loginedMemberVo");
        String message = (String) map.get("message");

        if (loginedMember != null && loginedMember.getM_role().equals("ROLE_ADMIN")) {
            if (loginedMember.getM_approval() == 1) { // 승인된 사용자
                String token = jwtUtil.generateToken(loginedMember.getM_email(), loginedMember.getM_role(), loginedMember.getM_approval());
                log.info("JWT 생성: {}", token);

                // 성공 응답 데이터
                map.put("token", token); // 토큰 추가
                map.put("status", HttpStatus.OK.value()); // HTTP 상태 코드 추가
                return ResponseEntity.ok(map);
            } else { // 승인 대기 중
                log.warn("승인 대기 중 사용자: {}", memberVo.getM_email());
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message", "승인 대기 중입니다. 관리자의 승인을 기다려주세요.",
                                "status", HttpStatus.FORBIDDEN.value()
                        ));
            }
        } else { // 로그인 실패 (계정 없음 또는 비밀번호 불일치)
            log.warn("로그인 실패: {}", message);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message", message,
                            "status", HttpStatus.UNAUTHORIZED.value()
                    ));
        }
    }

    @PostMapping("/joinConfirm")
    public ResponseEntity<?> joinConfirm(@RequestBody MemberVo memberVo) {
        int result = adminService.joinConfirm(memberVo);
        log.info("관리자회원가입: {}", memberVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

    }

    @GetMapping("/adminMembers")
    public ResponseEntity<?> adminMembers() {
        List<MemberVo> adminList = adminService.adminMembers();
        log.info("관리자회원 리스트: {}", adminList);
        if (adminList.size()>0) {
            return ResponseEntity.ok(adminList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }

    }

    @GetMapping("/userMembers")
    public ResponseEntity<?> userMembers() {
        List<MemberVo> userList = adminService.userMembers();
        log.info("관리자회원 리스트: {}", userList);
        if (userList.size()>0) {
            return ResponseEntity.ok(userList);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("오류");
        }

    }

    @PutMapping("/setAdminApproval")
    public ResponseEntity<?> setAdminApproval(@RequestBody MemberVo memberVo) {
        int result = adminService.setAdminApproval(memberVo);
        log.info("관리자 승인처리: {}", memberVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

    }

    @PutMapping("/setMemberUpgrade")
    public ResponseEntity<?> setMemberUpgrade(@RequestBody MemberVo memberVo) {
        int result = adminService.setMemberUpgrade(memberVo);
        log.info("관리자 승인처리: {}", memberVo);
        if (result>0) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

    }


}
