package com.wingbank.config.translation.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.translation.service.TranslationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/mobile/translations")
@Tag(name = "Mobile Translations")
@RequiredArgsConstructor
public class MobileTranslationController {

    private final TranslationService translationService;

    @GetMapping
    @Operation(summary = "Get translations for mobile app (no authentication required)")
    public ResponseEntity<ApiResponse<Map<String, String>>> getMobileTranslations(
            @RequestParam(defaultValue = "en") String lang,
            @RequestParam(defaultValue = "1.0") String version,
            @RequestParam(defaultValue = "ALL") String platform) {
        Map<String, String> translations = translationService.getMobileTranslations(lang, platform, version);
        return ResponseEntity.ok(ApiResponse.success(translations));
    }
}
