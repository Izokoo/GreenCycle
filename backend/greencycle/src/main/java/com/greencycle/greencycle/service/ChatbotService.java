package com.greencycle.greencycle.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class ChatbotService {

    @Value("${ollama.url}")
    private String url;

    @Value("${ollama.model}")
    private String model;

    private final ObjectMapper mapper = new ObjectMapper();

    public String repondre(String question) {
        try {

            String q = question.toLowerCase();

            // =========================
            // GREENPOINTS (IMPORTANT)
            // =========================
            if (q.contains("point")) {
                return "Chaque kilogramme recyclé rapporte environ 10 points écologiques. Recycle plus pour monter dans le classement.";
            }

            // =========================
            // QUOI RECYCLER
            // =========================
            if (q.contains("quoi") && q.contains("recycler")) {
                return "Tu peux recycler le papier, le carton, le plastique, le verre et le métal.";
            }

            // =========================
            // DETECTION TYPE
            // =========================
            String type = "";

            if (q.contains("plastique")) type = "plastique";
            else if (q.contains("verre")) type = "verre";
            else if (q.contains("papier") || q.contains("carton")) type = "papier";
            else if (q.contains("pile") || q.contains("batterie")) type = "pile";
            else if (q.contains("metal") || q.contains("canette")) type = "metal";

            // =========================
            // DETECTION QUANTITE
            // =========================
            int quantite = 1;

            for (String word : q.split(" ")) {
                try {
                    quantite = Integer.parseInt(word);
                    break;
                } catch (Exception ignored) {}
            }

            // =========================
            // REPONSE METIER
            // =========================
            if (!type.isEmpty()) {

                String lieu;
                String impact;

                switch (type) {
                    case "plastique":
                        lieu = "dans le bac de recyclage";
                        impact = "Cela réduit la pollution des océans.";
                        break;

                    case "verre":
                        lieu = "dans un conteneur à verre";
                        impact = "Le verre est recyclable à l’infini.";
                        break;

                    case "papier":
                        lieu = "dans le bac de recyclage";
                        impact = "Recycler le papier sauve des arbres.";
                        break;

                    case "pile":
                        lieu = "dans un point de collecte spécialisé";
                        impact = "Les piles sont toxiques pour l’environnement.";
                        break;

                    case "metal":
                        lieu = "dans le bac de recyclage";
                        impact = "Le recyclage du métal économise beaucoup d’énergie.";
                        break;

                    default:
                        lieu = "dans un centre de recyclage";
                        impact = "";
                }

                return "Tu peux jeter " + quantite + " " + type + "(s) " + lieu + ". " + impact;
            }

            // =========================
            // FALLBACK IA
            // =========================
            String prompt = """
            Tu es un expert du recyclage.
            Réponds clairement à la question.
            Réponse courte (max 2 phrases).
            Sujet: écologie uniquement.

            Question: %s
            """.formatted(question);

            String body = """
            {
              "model": "%s",
              "prompt": "%s",
              "stream": false
            }
            """.formatted(model, prompt.replace("\"", "\\\""));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpClient client = HttpClient.newHttpClient();

            HttpResponse<String> response = client.send(request,
                    HttpResponse.BodyHandlers.ofString());

            JsonNode root = mapper.readTree(response.body());

            if (root.has("response")) {
                return root.get("response").asText().trim();
            }

            return "Je ne suis pas sûr. Reformule ta question.";

        } catch (Exception e) {
            return "Erreur chatbot : " + e.getMessage();
        }
    }
}