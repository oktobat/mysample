package com.example.mysample;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@SpringBootApplication
public class MysampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(MysampleApplication.class, args);
	}

	// 프론트에서 npm run dev 로 실행할때 필요한 코드
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // 모든 경로에 대한 HTTP 요청을 처리
						.allowedMethods("*") // 모든 http 메소드를 허용
						.allowedOrigins("http://localhost:5173"); // "http://localhost:5173"에서 오는 요청만 허용
			}
		};
	}

}
