package com.wingbank.config.wingplus.mobile;

import com.wingbank.config.common.dto.ApiResponse;
import com.wingbank.config.wingplus.banner.entity.WingBanner;
import com.wingbank.config.wingplus.banner.entity.WingBannerTranslation;
import com.wingbank.config.wingplus.banner.repository.WingBannerRepository;
import com.wingbank.config.wingplus.category.entity.WingCategory;
import com.wingbank.config.wingplus.category.entity.WingCategoryTranslation;
import com.wingbank.config.wingplus.category.repository.WingCategoryRepository;
import com.wingbank.config.wingplus.location.entity.WingLocation;
import com.wingbank.config.wingplus.location.repository.WingLocationRepository;
import com.wingbank.config.wingplus.wingservice.entity.WingService;
import com.wingbank.config.wingplus.wingservice.entity.WingServiceTranslation;
import com.wingbank.config.wingplus.wingservice.repository.WingServiceRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mobile/wing-plus")
@Tag(name = "Wing+ Mobile API")
@RequiredArgsConstructor
public class WingPlusMobileController {

    private static final String FALLBACK = "en";

    private final WingLocationRepository locationRepository;
    private final WingCategoryRepository categoryRepository;
    private final WingServiceRepository serviceRepository;
    private final WingBannerRepository bannerRepository;

    // ── Locations ─────────────────────────────────────────────────────────────

    @GetMapping("/locations")
    @Operation(summary = "Get all active locations")
    public ResponseEntity<ApiResponse<List<LocationDto>>> getLocations(
            @RequestParam(defaultValue = "en") String lang) {
        List<LocationDto> data = locationRepository
                .findByStatusOrderBySortOrder(WingLocation.Status.ACTIVE)
                .stream()
                .map(l -> LocationDto.builder()
                        .id(l.getId()).name(l.getName()).icon(l.getIcon())
                        .sortOrder(l.getSortOrder()).build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Banners ───────────────────────────────────────────────────────────────

    @GetMapping("/banners")
    @Operation(summary = "Get all active banners (localized)")
    public ResponseEntity<ApiResponse<List<BannerDto>>> getBanners(
            @RequestParam(defaultValue = "en") String lang) {
        List<BannerDto> data = bannerRepository
                .findByStatusOrderBySortOrder(WingBanner.Status.ACTIVE)
                .stream()
                .map(b -> {
                    WingBannerTranslation t = pickBannerTranslation(b.getTranslations(), lang);
                    return BannerDto.builder()
                            .id(b.getId())
                            .imageUrl(t != null ? t.getImageUrl() : null)
                            .linkUrl(b.getLinkUrl())
                            .sortOrder(b.getSortOrder()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Categories ────────────────────────────────────────────────────────────

    @GetMapping("/categories")
    @Operation(summary = "Get all active categories (localized)")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories(
            @RequestParam(defaultValue = "en") String lang) {
        List<CategoryDto> data = categoryRepository
                .findByStatusOrderBySortOrder(WingCategory.Status.ACTIVE)
                .stream()
                .map(c -> {
                    WingCategoryTranslation t = pickCategoryTranslation(c.getTranslations(), lang);
                    return CategoryDto.builder()
                            .id(c.getId()).key(c.getKey()).icon(c.getIcon()).imageUrl(c.getImageUrl())
                            .name(t != null ? t.getName() : c.getKey())
                            .displayName(t != null ? t.getDisplayName() : c.getKey())
                            .sortOrder(c.getSortOrder()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Category Services ─────────────────────────────────────────────────────

    @GetMapping("/categories/{id}/services")
    @Operation(summary = "Get active services for a category (localized)")
    public ResponseEntity<ApiResponse<List<ServiceDto>>> getCategoryServices(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "en") String lang) {
        List<ServiceDto> data = serviceRepository
                .findByCategoryIdAndStatusOrderBySortOrder(id, WingService.Status.ACTIVE)
                .stream()
                .map(s -> {
                    WingServiceTranslation t = pickServiceTranslation(s.getTranslations(), lang);
                    return ServiceDto.builder()
                            .id(s.getId()).icon(s.getIcon()).imageUrl(s.getImageUrl())
                            .title(t != null ? t.getTitle() : null)
                            .description(t != null ? t.getDescription() : null)
                            .sortOrder(s.getSortOrder()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Partners (all active) ─────────────────────────────────────────────────

    @GetMapping("/partners")
    @Operation(summary = "Get all active partners (localized)")
    public ResponseEntity<ApiResponse<List<PartnerDto>>> getPartners(
            @RequestParam(defaultValue = "en") String lang) {
        List<PartnerDto> data = serviceRepository
                .findByStatusOrderBySortOrder(WingService.Status.ACTIVE)
                .stream()
                .map(s -> mapToPartnerDto(s, lang))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Popular Partners ──────────────────────────────────────────────────────

    @GetMapping("/popular-partners")
    @Operation(summary = "Get popular partners with display config (localized)")
    public ResponseEntity<ApiResponse<List<PopularPartnerDto>>> getPopularPartners(
            @RequestParam(defaultValue = "en") String lang) {
        List<PopularPartnerDto> data = serviceRepository
                .findByIsPopularAndStatusOrderByPopularSortOrder(true, WingService.Status.ACTIVE)
                .stream()
                .map(s -> {
                    WingServiceTranslation t = pickServiceTranslation(s.getTranslations(), lang);
                    return PopularPartnerDto.builder()
                            .id(s.getId())
                            .icon(s.getIcon()).imageUrl(s.getImageUrl())
                            .name(t != null ? t.getTitle() : null)
                            .description(t != null ? t.getDescription() : null)
                            .popularEmoji(s.getPopularEmoji())
                            .popularBgColor(s.getPopularBgColor())
                            .popularBorderColor(s.getPopularBorderColor())
                            .popularSortOrder(s.getPopularSortOrder()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── New Partners ──────────────────────────────────────────────────────────

    @GetMapping("/new-partners")
    @Operation(summary = "Get new partners with display config (localized)")
    public ResponseEntity<ApiResponse<List<NewPartnerDto>>> getNewPartners(
            @RequestParam(defaultValue = "en") String lang) {
        List<NewPartnerDto> data = serviceRepository
                .findByIsNewAndStatusOrderByNewSortOrder(true, WingService.Status.ACTIVE)
                .stream()
                .map(s -> {
                    WingServiceTranslation t = pickServiceTranslation(s.getTranslations(), lang);
                    return NewPartnerDto.builder()
                            .id(s.getId())
                            .icon(s.getIcon()).imageUrl(s.getImageUrl())
                            .name(t != null ? t.getTitle() : null)
                            .description(t != null ? t.getDescription() : null)
                            .newBgColor(s.getNewBgColor())
                            .newBorderColor(s.getNewBorderColor())
                            .newBadge(s.getNewBadge())
                            .newSortOrder(s.getNewSortOrder()).build();
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private PartnerDto mapToPartnerDto(WingService s, String lang) {
        WingServiceTranslation t = pickServiceTranslation(s.getTranslations(), lang);
        return PartnerDto.builder()
                .id(s.getId()).icon(s.getIcon()).imageUrl(s.getImageUrl())
                .isPopular(s.isPopular()).isNew(s.isNew())
                .name(t != null ? t.getTitle() : null)
                .description(t != null ? t.getDescription() : null)
                .sortOrder(s.getSortOrder()).build();
    }

    private WingBannerTranslation pickBannerTranslation(List<WingBannerTranslation> list, String lang) {
        if (list == null || list.isEmpty()) return null;
        return list.stream().filter(t -> t.getLanguageCode().equals(lang)).findFirst()
                .orElseGet(() -> list.stream().filter(t -> t.getLanguageCode().equals(FALLBACK)).findFirst()
                        .orElse(list.get(0)));
    }

    private WingCategoryTranslation pickCategoryTranslation(List<WingCategoryTranslation> list, String lang) {
        if (list == null || list.isEmpty()) return null;
        return list.stream().filter(t -> t.getLanguageCode().equals(lang)).findFirst()
                .orElseGet(() -> list.stream().filter(t -> t.getLanguageCode().equals(FALLBACK)).findFirst()
                        .orElse(list.get(0)));
    }

    private WingServiceTranslation pickServiceTranslation(List<WingServiceTranslation> list, String lang) {
        if (list == null || list.isEmpty()) return null;
        return list.stream().filter(t -> t.getLanguageCode().equals(lang)).findFirst()
                .orElseGet(() -> list.stream().filter(t -> t.getLanguageCode().equals(FALLBACK)).findFirst()
                        .orElse(list.get(0)));
    }

    // ── Mobile DTOs ───────────────────────────────────────────────────────────

    @Data @Builder public static class LocationDto {
        private UUID id; private String name; private String icon; private int sortOrder;
    }
    @Data @Builder public static class BannerDto {
        private UUID id; private String imageUrl; private String linkUrl; private int sortOrder;
    }
    @Data @Builder public static class CategoryDto {
        private UUID id; private String key; private String icon; private String imageUrl;
        private String name; private String displayName; private int sortOrder;
    }
    @Data @Builder public static class ServiceDto {
        private UUID id; private String icon; private String imageUrl;
        private String title; private String description; private int sortOrder;
    }
    @Data @Builder public static class PartnerDto {
        private UUID id; private String icon; private String imageUrl;
        private boolean isPopular; private boolean isNew;
        private String name; private String description; private int sortOrder;
    }
    @Data @Builder public static class PopularPartnerDto {
        private UUID id; private String icon; private String imageUrl;
        private String name; private String description;
        private String popularEmoji; private String popularBgColor; private String popularBorderColor;
        private int popularSortOrder;
    }
    @Data @Builder public static class NewPartnerDto {
        private UUID id; private String icon; private String imageUrl;
        private String name; private String description;
        private String newBgColor; private String newBorderColor; private String newBadge;
        private int newSortOrder;
    }
}
