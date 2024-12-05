package com.example.mysample.config;

import com.example.mysample.filter.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // 모든 OPTIONS 요청 허용
                .requestMatchers("/", "/static/**", "/goodsImg/**", "/index.html", "/assets/**", "/goodsDetail").permitAll() // 정적 자원 허용
                .requestMatchers("/admin/loginConfirm", "/admin/joinConfirm",
                        "/member/loginConfirm", "/member/joinConfirm",
                        "/error", "/goods/**", "/review/**", "/oauth/**").permitAll() // 인증 불필요
                .requestMatchers("/admin/adminMembers", "/goods/registerGoodsConfirm", "/goods/updateImage", "/goods/removeImage", "/goods/updateImage", "/goods/registerImage", "/goods/modifyGoodsConfirm", "/admin/setMemberUpgrade").hasRole("ADMIN") // 관리자 권한 필요
                .requestMatchers(HttpMethod.POST, "/cart/**", "/payment/**", "/order/**", "/receipt/**", "/member/modifyMemberConfirm").hasAnyRole("MEMBER", "ADMIN")
                .anyRequest().authenticated() // 나머지 요청은 인증 필요
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // JWT 필터 추가
                .httpBasic().disable() // 기본 HTTP Basic 인증 비활성화
                .csrf().disable() // CSRF 비활성화
                .exceptionHandling()
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden");
                });


        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


}