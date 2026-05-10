package com.greencycle.greencycle.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.Normalizer;

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
            String normalized = normalize(question);

            if (isPilesQuestion(normalized)) {
                return "Les piles ne vont pas a la poubelle classique. Apportez-les dans un point de collecte specifique, en magasin ou en decheterie.";
            }

            if (isGreenPointsQuestion(normalized)) {
                return "Chaque kg de plastique rapporte 10 points et le metal 15 points. Planifiez une nouvelle collecte pour gagner plus vite.";
            }

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

    private boolean isPilesQuestion(String text) {
        return text.contains("piles")
                && (text.contains("usagees") || text.contains("usees"))
                && (text.contains("jeter") || text.contains("mettre") || text.contains("deposer"));
    }

    private boolean isGreenPointsQuestion(String text) {
        return (text.contains("gagner") || text.contains("obtenir") || text.contains("avoir"))
                && text.contains("points");
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        String lower = value.trim().toLowerCase();
        String noAccent = Normalizer.normalize(lower, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return noAccent.replaceAll("[^a-z0-9\\s]", " ").replaceAll("\\s+", " ").trim();
    }
}