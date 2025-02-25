package com.kkm.fullstackproject1.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:8081") // React Native Web이 실행되는 주소

public class HelloController {

    private static final Logger log = LoggerFactory.getLogger(HelloController.class);

    private static final List<String> words = Arrays.asList("hello", "springboot", "and", "react native", "world");
    private final Map<String, List<String>> clientMessages = new ConcurrentHashMap<>();
    private final Set<String> runningClients = Collections.synchronizedSet(new HashSet<>());

    @GetMapping("/hello")
    public Mono<String> sayHello() {
        log.info("🚀 클라이언트 요청 받음: /api/hello");
        return Mono.just("Hello, World!");
    }

    @PostMapping("/start")
    public Mono<String> startProcess(@RequestParam String clientId) {
        if (runningClients.contains(clientId)) {
            return Mono.just("🚨 이미 실행 중입니다!");
        }

        runningClients.add(clientId);
        clientMessages.put(clientId, new ArrayList<>());

        Flux.interval(Duration.ofSeconds(5))
                .take(words.size()) // 최대 5개까지만 추가
                .doOnNext(i -> {
                    List<String> messages = clientMessages.get(clientId);
                    if (messages != null) {
                        messages.add(words.get(i.intValue()));
                        log.info("📌 클라이언트 [" + clientId + "] 데이터 추가됨: " + messages);
                    }
                })
                .doFinally(signal -> runningClients.remove(clientId)) // 완료되면 실행 중 목록에서 제거
                .subscribe();

        return Mono.just("✅ [" + clientId + "] 리스트 채우기 시작!");
    }

    @GetMapping("/messages")
    public Flux<List<String>> getMessages(@RequestParam String clientId) {
        List<String> messages = clientMessages.getOrDefault(clientId, new ArrayList<>());
        return Flux.just(messages); // JSON 배열로 반환
    }
}