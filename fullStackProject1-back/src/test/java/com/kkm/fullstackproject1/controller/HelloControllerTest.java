package com.kkm.fullstackproject1.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.test.web.reactive.server.WebTestClient;

import static org.assertj.core.api.Assertions.assertThat;


@WebFluxTest(controllers = HelloController.class) // WebFlux 컨트롤러 테스트 설정
public class HelloControllerTest {

    @Autowired
    private WebTestClient webTestClient; // 비동기 요청을 테스트하는 WebFlux 전용 클라이언트

    @Test
    void helloApiShouldReturnHelloWorld() {
        webTestClient.get().uri("/api/hello") // GET 요청
                .exchange() // 요청 실행
                .expectStatus().isOk() // 응답 상태 코드가 200인지 확인
                .expectBody(String.class) // 응답 본문이 String 타입인지 확인
                .value(response -> assertThat(response).isEqualTo("Hello, World!")); // 응답 값 검증
    }
}