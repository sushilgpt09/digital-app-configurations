package com.wingbank.config.applanguage.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.applanguage.dto.AppLanguageRequest;
import com.wingbank.config.applanguage.dto.AppLanguageResponse;

import java.util.List;
import java.util.UUID;

public interface AppLanguageService {

    PagedResponse<AppLanguageResponse> getAllLanguages(String search, String status, int page, int size);

    AppLanguageResponse getLanguageById(UUID id);

    AppLanguageResponse createLanguage(AppLanguageRequest request);

    AppLanguageResponse updateLanguage(UUID id, AppLanguageRequest request);

    void deleteLanguage(UUID id);

    List<AppLanguageResponse> getActiveLanguages();
}
