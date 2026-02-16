package com.wingbank.config.country.service;

import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.country.dto.CountryRequest;
import com.wingbank.config.country.dto.CountryResponse;

import java.util.List;
import java.util.UUID;

public interface CountryService {

    PagedResponse<CountryResponse> getAllCountries(String search, String status, int page, int size);

    CountryResponse getCountryById(UUID id);

    CountryResponse createCountry(CountryRequest request);

    CountryResponse updateCountry(UUID id, CountryRequest request);

    void deleteCountry(UUID id);

    List<CountryResponse> getActiveCountries();
}
