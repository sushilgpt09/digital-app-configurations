package com.wingbank.config.wingplus.banner.repository;

import com.wingbank.config.wingplus.banner.entity.WingBanner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WingBannerRepository extends JpaRepository<WingBanner, UUID> {

    List<WingBanner> findByStatusOrderBySortOrder(WingBanner.Status status);

    @Query(value = "SELECT * FROM wing_banners WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_banners WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingBanner> findAllWithFilters(@Param("status") String status, Pageable pageable);
}
