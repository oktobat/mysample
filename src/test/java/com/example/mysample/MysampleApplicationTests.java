package com.example.mysample;

import org.junit.jupiter.api.Test;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@MapperScan("com.example.mysample")
class MysampleApplicationTests {

	@Test
	void contextLoads() {
	}

}
