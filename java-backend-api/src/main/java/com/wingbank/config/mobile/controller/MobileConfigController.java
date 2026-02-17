package com.wingbank.config.mobile.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.country.dto.CountryResponse;
import com.wingbank.config.country.entity.Country;
import com.wingbank.config.country.repository.CountryRepository;
import com.wingbank.config.globalconfig.entity.GlobalConfig;
import com.wingbank.config.globalconfig.repository.GlobalConfigRepository;
import com.wingbank.config.message.entity.ApiMessage;
import com.wingbank.config.message.entity.ApiMessageValue;
import com.wingbank.config.message.repository.ApiMessageRepository;
import com.wingbank.config.mobile.dto.MobileConfigResponse;
import com.wingbank.config.translation.entity.Translation;
import com.wingbank.config.translation.entity.TranslationValue;
import com.wingbank.config.translation.repository.TranslationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mobile")
@Tag(name = "Mobile Configuration", description = "Aggregated configuration endpoints for mobile apps")
@RequiredArgsConstructor
@Slf4j
public class MobileConfigController {

    private final TranslationRepository translationRepository;
    private final CountryRepository countryRepository;
    private final GlobalConfigRepository globalConfigRepository;
    private final ApiMessageRepository apiMessageRepository;

    @GetMapping("/config")
    @Operation(summary = "Get aggregated mobile configuration")
    @Cacheable(value = "mobileConfig", key = "#platform + '_' + #version + '_' + #lang")
    public ResponseEntity<ApiResponse<MobileConfigResponse>> getMobileConfig(
            @RequestParam(defaultValue = "ALL") String platform,
            @RequestParam(defaultValue = "1.0") String version,
            @RequestParam(defaultValue = "en") String lang) {

        log.debug("Fetching mobile config: platform={}, version={}, lang={}", platform, version, lang);

        // Translations
        List<Translation> translations = translationRepository.findByPlatformAndVersion(
                platform.toUpperCase(), version);
        Map<String, String> translationMap = new HashMap<>();
        for (Translation t : translations) {
            String value = getTranslationValue(t, lang);
            if (value == null) value = getTranslationValue(t, "en");
            if (value != null) {
                translationMap.put(t.getKey(), value);
            }
        }

        // Countries
        List<Country> countries = countryRepository.findByStatus(Country.Status.ACTIVE);
        List<CountryResponse> countryList = countries.stream()
                .map(c -> CountryResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .code(c.getCode())
                        .dialCode(c.getDialCode())
                        .flagUrl(c.getFlagUrl())
                        .currency(c.getCurrency())
                        .status(c.getStatus().name())
                        .build())
                .collect(Collectors.toList());

        // Global Configs
        List<GlobalConfig> configs = globalConfigRepository.findByPlatformActive(platform.toUpperCase());
        Map<String, String> configMap = configs.stream()
                .collect(Collectors.toMap(GlobalConfig::getConfigKey, GlobalConfig::getConfigValue,
                        (existing, replacement) -> replacement));

        // API Messages
        List<ApiMessage> messages = apiMessageRepository.findAll();
        Map<String, String> messageMap = new HashMap<>();
        for (ApiMessage m : messages) {
            if (!m.isDeleted()) {
                String value = getMessageValue(m, lang);
                if (value == null) value = getMessageValue(m, "en");
                if (value != null) {
                    messageMap.put(m.getErrorCode(), value);
                }
            }
        }

        // Feature flags from global configs
        Map<String, Object> featureFlags = new HashMap<>();
        configMap.entrySet().stream()
                .filter(e -> e.getKey().startsWith("feature."))
                .forEach(e -> featureFlags.put(e.getKey().replace("feature.", ""),
                        "true".equalsIgnoreCase(e.getValue())));

        MobileConfigResponse response = MobileConfigResponse.builder()
                .translations(translationMap)
                .countries(countryList)
                .globalConfigs(configMap)
                .apiMessages(messageMap)
                .featureFlags(featureFlags)
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private String getTranslationValue(Translation t, String lang) {
        if (t.getValues() == null) return null;
        return t.getValues().stream()
                .filter(v -> v.getLanguageCode().equalsIgnoreCase(lang))
                .map(TranslationValue::getValue)
                .findFirst()
                .orElse(null);
    }

    private String getMessageValue(ApiMessage m, String lang) {
        if (m.getValues() == null) return null;
        return m.getValues().stream()
                .filter(v -> v.getLanguageCode().equalsIgnoreCase(lang))
                .map(ApiMessageValue::getMessage)
                .findFirst()
                .orElse(null);
    }
}
