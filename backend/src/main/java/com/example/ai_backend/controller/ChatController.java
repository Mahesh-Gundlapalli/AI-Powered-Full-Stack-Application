package com.example.ai_backend.controller;

import com.example.ai_backend.payload.CricketResponse;
import com.example.ai_backend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/v1/chat")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public ResponseEntity<String> generateResponse(
            @RequestParam(value = "inputText") String inputText
    ){
        String responseText =  chatService.generateResponse(inputText);
        return ResponseEntity.ok(responseText);
    }

    @GetMapping("/stream")
    public Flux<String> generateStreamResponse(
            @RequestParam(value = "inputText") String inputText
    ){
        Flux<String> response = chatService.generateStreamResponse(inputText);
        return response;
    }

    @GetMapping("/cricket")
    public CricketResponse generateCricketResponse(
            @RequestParam("inputText") String inputText
    ) throws IOException {
        return chatService.generateCricketResponse(inputText);
    }

    @GetMapping("/images")
    public ResponseEntity<List<String>> generateImages(
            @RequestParam("imageDescription") String imageDesc,
            @RequestParam(value = "numberOfImages", required = false, defaultValue = "1") int numbers
    ) throws IOException {
        return ResponseEntity.ok(chatService.generateImages(imageDesc,numbers));
    }
}
