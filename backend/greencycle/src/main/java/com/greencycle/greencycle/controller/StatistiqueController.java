package com.greencycle.greencycle.controller;

import com.greencycle.greencycle.service.StatistiqueService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/stats")
public class StatistiqueController {

    private final StatistiqueService statistiqueService;

    public StatistiqueController(StatistiqueService statistiqueService) {
        this.statistiqueService = statistiqueService;
    }

    @GetMapping
    public Map<String, Object> getStats() {
        return statistiqueService.getStats();
    }
}