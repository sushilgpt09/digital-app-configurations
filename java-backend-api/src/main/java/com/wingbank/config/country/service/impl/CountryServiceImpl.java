package com.wingbank.config.country.service.impl;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.common.exception.BadRequestException;
import com.wingbank.config.common.exception.ResourceNotFoundException;
import com.wingbank.config.country.dto.CountryRequest;
import com.wingbank.config.country.dto.CountryResponse;
import com.wingbank.config.country.entity.Country;
import com.wingbank.config.country.repository.CountryRepository;
import com.wingbank.config.country.service.CountryService;
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
public class CountryServiceImpl implements CountryService {

    private final CountryRepository countryRepository;

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<CountryResponse> getAllCountries(String search, String status, int page, int size) {
        Country.Status statusEnum = status != null ? Country.Status.valueOf(status) : null;
        Page<Country> countryPage = countryRepository.findAllWithFilters(search, statusEnum, PageRequest.of(page, size));
        var content = countryPage.getContent().stream().map(this::toResponse).collect(Collectors.toList());
        return PagedResponse.from(countryPage, content);
    }

    @Override
    @Transactional(readOnly = true)
    public CountryResponse getCountryById(UUID id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));
        return toResponse(country);
    }

    @Override
    @Transactional
    public CountryResponse createCountry(CountryRequest request) {
        if (countryRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Country code already exists: " + request.getCode());
        }

        Country country = new Country();
        country.setName(request.getName());
        country.setCode(request.getCode());
        country.setDialCode(request.getDialCode());
        country.setFlagUrl(request.getFlagUrl());
        country.setCurrency(request.getCurrency());
        country.setStatus(request.getStatus() != null ? Country.Status.valueOf(request.getStatus()) : Country.Status.ACTIVE);

        Country saved = countryRepository.save(country);
        log.info("Country created: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CountryResponse updateCountry(UUID id, CountryRequest request) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));

        if (!country.getCode().equals(request.getCode()) && countryRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Country code already exists: " + request.getCode());
        }

        country.setName(request.getName());
        country.setCode(request.getCode());
        country.setDialCode(request.getDialCode());
        country.setFlagUrl(request.getFlagUrl());
        country.setCurrency(request.getCurrency());
        if (request.getStatus() != null) {
            country.setStatus(Country.Status.valueOf(request.getStatus()));
        }

        Country saved = countryRepository.save(country);
        log.info("Country updated: {}", saved.getCode());
        return toResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCountry(UUID id) {
        Country country = countryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Country", "id", id));
        country.setDeleted(true);
        countryRepository.save(country);
        log.info("Country soft deleted: {}", country.getCode());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CountryResponse> getActiveCountries() {
        return countryRepository.findByStatus(Country.Status.ACTIVE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private CountryResponse toResponse(Country country) {
        return CountryResponse.builder()
                .id(country.getId())
                .name(country.getName())
                .code(country.getCode())
                .dialCode(country.getDialCode())
                .flagUrl(country.getFlagUrl())
                .currency(country.getCurrency())
                .status(country.getStatus().name())
                .createdAt(country.getCreatedAt())
                .updatedAt(country.getUpdatedAt())
                .build();
    }
}
