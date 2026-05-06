package com.greencycle.greencycle.controller;

import com.greencycle.greencycle.service.ChatbotService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping
    public String poserQuestion(@RequestBody Map<String, String> body) {

        //  sécurise la récupération
        if (body == null || !body.containsKey("question")) {
            return "Question invalide";
        }

        String question = body.get("question");

        if (question == null || question.isEmpty()) {
            return "Veuillez poser une question";
        }

        return chatbotService.repondre(question);
    }
}