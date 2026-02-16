package com.wingbank.config.translation.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.translation.dto.TranslationRequest;
import com.wingbank.config.translation.dto.TranslationResponse;

import java.util.Map;
import java.util.UUID;

public interface TranslationService {

    PagedResponse<TranslationResponse> getAllTranslations(String search, String module, String platform, int page, int size);

    TranslationResponse getTranslationById(UUID id);

    TranslationResponse createTranslation(TranslationRequest request);

    TranslationResponse updateTranslation(UUID id, TranslationRequest request);

    void deleteTranslation(UUID id);

    Map<String, String> getMobileTranslations(String lang, String platform, String version);
}
