package com.example.mysample.controller;

import com.example.mysample.dto.LoginType;
import com.example.mysample.dto.MemberVo;
import com.example.mysample.service.MemberService;
import com.example.mysample.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/oauth")
public class OAuthController {

    private final JwtUtil jwtUtil;
    private final MemberService memberService;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.token-uri}")
    private String kakaoTokenUri;

    @Value("${kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    @Value("${google.client-id}")
    private String googleClientId;

    @Value("${google.client-secret}")
    private String googleClientSecret;

    @Value("${google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${google.token-uri}")
    private String googleTokenUri;

    @Value("${google.user-info-uri}")
    private String googleUserInfoUri;

    @PostMapping("/{provider}")
    public ResponseEntity<?> handleLogin(@PathVariable String provider, @RequestBody Map<String, String> body) {
        String code = body.get("code");
        log.info("sns코드 : {}", code);
        if (code == null) {
            return ResponseEntity.badRequest().body("Code is required");
        }
        try {
            if ("kakao".equalsIgnoreCase(provider)) {
                return kakaoLogin(code);
            } else if ("google".equalsIgnoreCase(provider)) {
                return googleLogin(code);
            } else {
                return ResponseEntity.badRequest().body("Unsupported provider: " + provider);
            }
        } catch (Exception e) {
            log.error("Error during {} login: {}", provider, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing login");
        }
    }

    private ResponseEntity<?> kakaoLogin(String code) {
        try {

            // 1. Get Access Token from Kakao
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("grant_type", "authorization_code");
            params.add("client_id", kakaoClientId);
            params.add("redirect_uri", kakaoRedirectUri);
            params.add("code", code);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(kakaoTokenUri, request, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get access token from Kakao");
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 2. Get User Info from Kakao
            headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(kakaoUserInfoUri, HttpMethod.GET, entity, Map.class);

            if (!userInfoResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get user info from Kakao");
            }

            Map<String, Object> kakaoAccount = (Map<String, Object>) userInfoResponse.getBody().get("kakao_account");
            String m_email = (String) kakaoAccount.get("email");
            String m_name = (String) ((Map<String, Object>) userInfoResponse.getBody().get("properties")).get("nickname");

            // 3. Process User Info
            MemberVo existingMember = memberService.oauthMember(m_email);
            if (existingMember == null ) {
                MemberVo newMember = new MemberVo();
                newMember.setM_email(m_email);
                newMember.setM_name(m_name);
                newMember.setM_kakaoId((String) userInfoResponse.getBody().get("id").toString());
                newMember.setM_loginType(LoginType.KAKAO);
                newMember.setM_role("ROLE_MEMBER");
                newMember.setM_approval(0);
                int m_no = memberService.oauthRegisterConfirm(newMember);
                newMember.setM_no(m_no);
                existingMember = newMember;
                log.info("existing 멤버 : {}", existingMember);
            }

            // 4. Generate JWT Token
            String token = jwtUtil.generateToken(existingMember.getM_email(), existingMember.getM_role(), existingMember.getM_approval());

            log.info("토큰 : {}", token);

            Map<String, Object> map = new HashMap<>();
            map.put("token", token);
            map.put("loginedMemberVo", existingMember);
            log.info("응답 데이터: {}", new ObjectMapper().writeValueAsString(map));
            return ResponseEntity.ok(map);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing Kakao login");
        }
    }

    private ResponseEntity<?> googleLogin(String code) {
        try {
            // 1. Get Access Token from Google
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", googleClientId); // Google Client ID
            params.add("client_secret", googleClientSecret); // Google Client Secret
            params.add("redirect_uri", googleRedirectUri); // Google Redirect URI
            params.add("grant_type", "authorization_code");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.postForEntity(googleTokenUri, request, Map.class);

            if (!tokenResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get access token from Google");
            }

            String accessToken = (String) tokenResponse.getBody().get("access_token");

            // 2. Get User Info from Google
            headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(googleUserInfoUri, HttpMethod.GET, entity, Map.class);

            if (!userInfoResponse.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to get user info from Google");
            }

            String email = (String) userInfoResponse.getBody().get("email");
            String name = (String) userInfoResponse.getBody().get("name");

            // 3. Process User Info
            MemberVo existingMember = memberService.oauthMember(email);
            if (existingMember == null) {
                MemberVo newMember = new MemberVo();
                newMember.setM_email(email);
                newMember.setM_name(name);
                newMember.setM_googleId((String) userInfoResponse.getBody().get("sub"));
                newMember.setM_loginType(LoginType.GOOGLE);
                newMember.setM_role("ROLE_MEMBER");
                newMember.setM_approval(0);
                int m_no = memberService.oauthRegisterConfirm(newMember);
                newMember.setM_no(m_no);
                existingMember = newMember;
                log.info("새 멤버 : {}", existingMember);
            }

            // 4. Generate JWT Token
            String token = jwtUtil.generateToken(existingMember.getM_email(), existingMember.getM_role(), existingMember.getM_approval());

            log.info("토큰 : {}", token);

            Map<String, Object> map = new HashMap<>();
            map.put("token", token);
            map.put("loginedMemberVo", existingMember);
            log.info("응답 데이터: {}", new ObjectMapper().writeValueAsString(map));
            return ResponseEntity.ok(map);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing Google login");
        }
    }


}