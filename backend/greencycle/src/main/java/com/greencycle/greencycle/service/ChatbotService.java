package com.greencycle.greencycle.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ChatbotService {

    @Value("${ollama.model}")
    private String model;

    private final ChatClient chatClient;

    public ChatbotService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String repondre(String question) {
        try {
            String prompt = """
            Tu es un expert du recyclage.
            Réponds clairement à la question.
            Réponse courte (max 2 phrases).
            Sujet: écologie uniquement.

            Question: %s
            """.formatted(question);

            String response = chatClient.prompt()
                    .user(prompt)
                    .options(OllamaOptions.builder().model(model).build())
                    .call()
                    .content();

            if (response == null || response.isBlank()) {
                return "Je ne suis pas sûr. Reformule ta question.";
            }

            return response.trim();

        } catch (Exception e) {
            return "Erreur chatbot : " + e.getMessage();
        }
    }
}