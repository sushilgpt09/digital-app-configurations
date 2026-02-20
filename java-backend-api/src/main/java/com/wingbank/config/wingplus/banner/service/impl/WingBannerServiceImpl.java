package com.wingbank.config.wingplus.banner.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.banner.dto.WingBannerRequest;
import com.wingbank.config.wingplus.banner.dto.WingBannerResponse;
import com.wingbank.config.wingplus.banner.dto.WingBannerTranslationData;
import com.wingbank.config.wingplus.banner.entity.WingBanner;
import com.wingbank.config.wingplus.banner.entity.WingBannerTranslation;
import com.wingbank.config.wingplus.banner.repository.WingBannerRepository;
import com.wingbank.config.wingplus.banner.service.WingBannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingBannerServiceImpl implements WingBannerService {

    private final WingBannerRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingBannerResponse> getAll(String status, int page, int size) {
        Page<WingBanner> pg = repository.findAllWithFilters(status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingBannerResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingBannerResponse create(WingBannerRequest req) {
        WingBanner e = new WingBanner();
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingBannerResponse update(UUID id, WingBannerRequest req) {
        WingBanner e = findOrThrow(id);
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingBanner e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    private void applyFields(WingBanner e, WingBannerRequest req) {
        e.setImageUrl(req.getImageUrl()); e.setGradientFrom(req.getGradientFrom());
        e.setGradientTo(req.getGradientTo()); e.setLinkUrl(req.getLinkUrl());
        e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingBanner.Status.valueOf(req.getStatus()) : WingBanner.Status.ACTIVE);
        e.getTranslations().clear();
        if (req.getTranslations() != null) {
            req.getTranslations().forEach((lang, data) -> {
                WingBannerTranslation t = new WingBannerTranslation();
                t.setBanner(e); t.setLanguageCode(lang);
                t.setTitle(data.getTitle()); t.setSubtitle(data.getSubtitle()); t.setOfferText(data.getOfferText());
                e.getTranslations().add(t);
            });
        }
    }

    private WingBanner findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingBanner", "id", id));
    }

    private WingBannerResponse toResponse(WingBanner e) {
        Map<String, WingBannerTranslationData> translations = new LinkedHashMap<>();
        for (WingBannerTranslation t : e.getTranslations()) {
            WingBannerTranslationData d = new WingBannerTranslationData();
            d.setTitle(t.getTitle()); d.setSubtitle(t.getSubtitle()); d.setOfferText(t.getOfferText());
            translations.put(t.getLanguageCode(), d);
        }
        return WingBannerResponse.builder()
                .id(e.getId()).imageUrl(e.getImageUrl()).gradientFrom(e.getGradientFrom())
                .gradientTo(e.getGradientTo()).linkUrl(e.getLinkUrl())
                .sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
