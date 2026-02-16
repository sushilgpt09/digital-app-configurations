package com.wingbank.config.country.controller;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.common.dto.PagedResponse;
import com.wingbank.config.country.dto.CountryRequest;
import com.wingbank.config.country.dto.CountryResponse;
import com.wingbank.config.country.service.CountryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/countries")
@Tag(name = "Countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    @PreAuthorize("hasAuthority('COUNTRY_VIEW')")
    @Operation(summary = "Get all countries with pagination and filters")
    public ResponseEntity<ApiResponse<PagedResponse<CountryResponse>>> getAllCountries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        PagedResponse<CountryResponse> countries = countryService.getAllCountries(search, status, page, size);
        return ResponseEntity.ok(ApiResponse.success(countries));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('COUNTRY_VIEW')")
    @Operation(summary = "Get country by ID")
    public ResponseEntity<ApiResponse<CountryResponse>> getCountryById(@PathVariable UUID id) {
        CountryResponse country = countryService.getCountryById(id);
        return ResponseEntity.ok(ApiResponse.success(country));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('COUNTRY_CREATE')")
    @Operation(summary = "Create a new country")
    public ResponseEntity<ApiResponse<CountryResponse>> createCountry(@Valid @RequestBody CountryRequest request) {
        CountryResponse country = countryService.createCountry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Country created successfully", country));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('COUNTRY_UPDATE')")
    @Operation(summary = "Update an existing country")
    public ResponseEntity<ApiResponse<CountryResponse>> updateCountry(
            @PathVariable UUID id,
            @Valid @RequestBody CountryRequest request) {
        CountryResponse country = countryService.updateCountry(id, request);
        return ResponseEntity.ok(ApiResponse.success("Country updated successfully", country));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('COUNTRY_DELETE')")
    @Operation(summary = "Soft delete a country")
    public ResponseEntity<ApiResponse<Void>> deleteCountry(@PathVariable UUID id) {
        countryService.deleteCountry(id);
        return ResponseEntity.ok(ApiResponse.success("Country deleted successfully", null));
    }
}
