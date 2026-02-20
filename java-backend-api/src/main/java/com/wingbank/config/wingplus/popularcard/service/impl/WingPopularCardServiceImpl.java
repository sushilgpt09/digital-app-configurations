package com.wingbank.config.wingplus.popularcard.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardRequest;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardResponse;
import com.wingbank.config.wingplus.popularcard.dto.WingPopularCardTranslationData;
import com.wingbank.config.wingplus.popularcard.entity.WingPopularCard;
import com.wingbank.config.wingplus.popularcard.entity.WingPopularCardTranslation;
import com.wingbank.config.wingplus.popularcard.repository.WingPopularCardRepository;
import com.wingbank.config.wingplus.popularcard.service.WingPopularCardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j
public class WingPopularCardServiceImpl implements WingPopularCardService {

    private final WingPopularCardRepository repository;

    @Override @Transactional(readOnly = true)
    public PagedResponse<WingPopularCardResponse> getAll(String status, int page, int size) {
        Page<WingPopularCard> pg = repository.findAllWithFilters(status, PageRequest.of(page, size));
        return PagedResponse.from(pg, pg.getContent().stream().map(this::toResponse).collect(Collectors.toList()));
    }

    @Override @Transactional(readOnly = true)
    public WingPopularCardResponse getById(UUID id) { return toResponse(findOrThrow(id)); }

    @Override @Transactional
    public WingPopularCardResponse create(WingPopularCardRequest req) {
        WingPopularCard e = new WingPopularCard();
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public WingPopularCardResponse update(UUID id, WingPopularCardRequest req) {
        WingPopularCard e = findOrThrow(id);
        applyFields(e, req);
        return toResponse(repository.save(e));
    }

    @Override @Transactional
    public void delete(UUID id) {
        WingPopularCard e = findOrThrow(id);
        e.setDeleted(true);
        repository.save(e);
    }

    private void applyFields(WingPopularCard e, WingPopularCardRequest req) {
        e.setEmoji(req.getEmoji()); e.setBgColor(req.getBgColor()); e.setBorderColor(req.getBorderColor());
        e.setLinkUrl(req.getLinkUrl()); e.setSortOrder(req.getSortOrder());
        e.setStatus(req.getStatus() != null ? WingPopularCard.Status.valueOf(req.getStatus()) : WingPopularCard.Status.ACTIVE);
        e.getTranslations().clear();
        if (req.getTranslations() != null) {
            req.getTranslations().forEach((lang, data) -> {
                WingPopularCardTranslation t = new WingPopularCardTranslation();
                t.setPopularCard(e); t.setLanguageCode(lang);
                t.setTitle(data.getTitle()); t.setSubtitle(data.getSubtitle());
                e.getTranslations().add(t);
            });
        }
    }

    private WingPopularCard findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("WingPopularCard", "id", id));
    }

    private WingPopularCardResponse toResponse(WingPopularCard e) {
        Map<String, WingPopularCardTranslationData> translations = new LinkedHashMap<>();
        for (WingPopularCardTranslation t : e.getTranslations()) {
            WingPopularCardTranslationData d = new WingPopularCardTranslationData();
            d.setTitle(t.getTitle()); d.setSubtitle(t.getSubtitle());
            translations.put(t.getLanguageCode(), d);
        }
        return WingPopularCardResponse.builder()
                .id(e.getId()).emoji(e.getEmoji()).bgColor(e.getBgColor()).borderColor(e.getBorderColor())
                .linkUrl(e.getLinkUrl()).sortOrder(e.getSortOrder()).status(e.getStatus().name())
                .translations(translations).createdAt(e.getCreatedAt()).updatedAt(e.getUpdatedAt()).build();
    }
}
