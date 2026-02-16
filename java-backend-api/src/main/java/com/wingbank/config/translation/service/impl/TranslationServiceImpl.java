package com.wingbank.config.translation.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.translation.dto.TranslationRequest;
import com.wingbank.config.translation.dto.TranslationResponse;
import com.wingbank.config.translation.entity.Translation;
import com.wingbank.config.translation.repository.TranslationRepository;
import com.wingbank.config.translation.service.TranslationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TranslationServiceImpl implements TranslationService {

    private final TranslationRepository translationRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TranslationResponse> getAllTranslations(String search, String module, String platform, int page, int size) {
        Page<Translation> translationPage = translationRepository.findAllWithFilters(search, module, platform, PageRequest.of(page, size));
        var content = translationPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(translationPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public TranslationResponse getTranslationById(UUID id) {
        Translation translation = translationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Translation", "id", id));
        return toResponse(translation);
    }

    @Override
    @Transactional
    public TranslationResponse createTranslation(TranslationRequest request) {
        Translation translation = new Translation();
        translation.setKey(request.getKey());
        translation.setEnValue(request.getEnValue());
        translation.setKmValue(request.getKmValue());
        translation.setModule(request.getModule());
        translation.setVersion(request.getVersion() != null ? request.getVersion() : "1.0");
        translation.setPlatform(request.getPlatform() != null ? request.getPlatform() : "ALL");

        Translation saved = translationRepository.save(translation);
        log.info("Translation created: {}", saved.getKey());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public TranslationResponse updateTranslation(UUID id, TranslationRequest request) {
        Translation translation = translationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Translation", "id", id));

        translation.setKey(request.getKey());
        translation.setEnValue(request.getEnValue());
        translation.setKmValue(request.getKmValue());
        translation.setModule(request.getModule());
        if (request.getVersion() != null) {
            translation.setVersion(request.getVersion());
        }
        if (request.getPlatform() != null) {
            translation.setPlatform(request.getPlatform());
        }

        Translation saved = translationRepository.save(translation);
        log.info("Translation updated: {}", saved.getKey());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteTranslation(UUID id) {
        Translation translation = translationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Translation", "id", id));
        translation.setDeleted(true);
        translationRepository.save(translation);
        log.info("Translation soft deleted: {}", translation.getKey());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> getMobileTranslations(String lang, String platform, String version) {
        String resolvedPlatform = platform != null ? platform : "ALL";
        String resolvedVersion = version != null ? version : "999.0";

        List<Translation> translations = translationRepository.findByPlatformAndVersion(resolvedPlatform, resolvedVersion);

        Map<String, String> result = new LinkedHashMap<>();
        for (Translation t : translations) {
            String value;
            if ("km".equalsIgnoreCase(lang)) {
                value = t.getKmValue() != null ? t.getKmValue() : t.getEnValue();
            } else {
                value = t.getEnValue() != null ? t.getEnValue() : t.getKmValue();
            }
            if (value != null) {
                result.put(t.getKey(), value);
            }
        }
        return result;
    }

    private TranslationResponse toResponse(Translation translation) {
        return TranslationResponse.builder()
                .id(translation.getId())
                .key(translation.getKey())
                .enValue(translation.getEnValue())
                .kmValue(translation.getKmValue())
                .module(translation.getModule())
                .version(translation.getVersion())
                .platform(translation.getPlatform())
                .createdAt(translation.getCreatedAt())
                .updatedAt(translation.getUpdatedAt())
                .build();
    }
}
