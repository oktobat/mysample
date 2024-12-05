package com.example.mysample.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationTime; // 토큰 만료 시간 (밀리초)

    // JWT 생성 메서드
    public String generateToken(String email, String role, int approval) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // 예: 관리자 승인 정보
        claims.put("approval", approval); // 예: 관리자 승인 정보

        return Jwts.builder()
            .setClaims(claims) // 클레임 추가
            .setSubject(email) // 사용자 이메일 설정
            .setIssuedAt(new Date()) // 토큰 생성 시간
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // 만료 시간 설정
            .signWith(SignatureAlgorithm.HS256, secretKey) // 서명 알고리즘 및 비밀 키
            .compact(); // 최종적으로 JWT 문자열 생성
    }

    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        }  catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT 토큰이 만료되었습니다.");
        } catch (MalformedJwtException e) {
            throw new RuntimeException("JWT 토큰이 잘못되었습니다.");
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("JWT 토큰이 비어 있거나 잘못된 형식입니다.");
        }
    }

    // 이메일 추출
    public String extractEmail(String token) {
        return validateToken(token).getSubject();
    }

    // 역할(Role) 추출
    public String extractRole(String token) {
        return validateToken(token).get("role", String.class);
    }

    // 역할(Role) 추출
    public int extractApproval(String token) {
        return validateToken(token).get("approval", Integer.class);
    }

}
