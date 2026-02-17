package com.wingbank.config.applanguage.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.applanguage.dto.AppLanguageRequest;
import com.wingbank.config.applanguage.dto.AppLanguageResponse;
import com.wingbank.config.applanguage.entity.AppLanguage;
import com.wingbank.config.applanguage.repository.AppLanguageRepository;
import com.wingbank.config.applanguage.service.AppLanguageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppLanguageServiceImpl implements AppLanguageService {

    private final AppLanguageRepository appLanguageRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<AppLanguageResponse> getAllLanguages(String search, String status, int page, int size) {
        Page<AppLanguage> languagePage = appLanguageRepository.findAllWithFilters(search, status, PageRequest.of(page, size));
        var content = languagePage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(languagePage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public AppLanguageResponse getLanguageById(UUID id) {
        AppLanguage language = appLanguageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppLanguage", "id", id));
        return toResponse(language);
    }

    @Override
    @Transactional
    public AppLanguageResponse createLanguage(AppLanguageRequest request) {
        if (appLanguageRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Language code already exists: " + request.getCode());
        }

        AppLanguage language = new AppLanguage();
        language.setName(request.getName());
        language.setNativeName(request.getNativeName());
        language.setCode(request.getCode());
        language.setStatus(request.getStatus() != null ? AppLanguage.Status.valueOf(request.getStatus()) : AppLanguage.Status.ACTIVE);

        AppLanguage saved = appLanguageRepository.save(language);
        log.info("App language created: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public AppLanguageResponse updateLanguage(UUID id, AppLanguageRequest request) {
        AppLanguage language = appLanguageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppLanguage", "id", id));

        if (!language.getCode().equals(request.getCode()) && appLanguageRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Language code already exists: " + request.getCode());
        }

        language.setName(request.getName());
        language.setNativeName(request.getNativeName());
        language.setCode(request.getCode());
        if (request.getStatus() != null) {
            language.setStatus(AppLanguage.Status.valueOf(request.getStatus()));
        }

        AppLanguage saved = appLanguageRepository.save(language);
        log.info("App language updated: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteLanguage(UUID id) {
        AppLanguage language = appLanguageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AppLanguage", "id", id));
        language.setDeleted(true);
        appLanguageRepository.save(language);
        log.info("App language soft deleted: {}", language.getCode());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppLanguageResponse> getActiveLanguages() {
        return appLanguageRepository.findByStatus(AppLanguage.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private AppLanguageResponse toResponse(AppLanguage language) {
        return AppLanguageResponse.builder()
                .id(language.getId())
                .name(language.getName())
                .nativeName(language.getNativeName())
                .code(language.getCode())
                .status(language.getStatus().name())
                .createdAt(language.getCreatedAt())
                .updatedAt(language.getUpdatedAt())
                .build();
    }
}
