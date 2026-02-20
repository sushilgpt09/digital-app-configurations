package com.wingbank.config.wingplus.wingservice.repository;

import com.wingbank.config.wingplus.wingservice.entity.WingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WingServiceRepository extends JpaRepository<WingService, UUID> {

    List<WingService> findByCategoryIdAndStatusOrderBySortOrder(UUID categoryId, WingService.Status status);

    @Query(value = "SELECT * FROM wing_services WHERE deleted = false " +
           "AND (:categoryId IS NULL OR category_id = CAST(:categoryId AS UUID)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_services WHERE deleted = false " +
           "AND (:categoryId IS NULL OR category_id = CAST(:categoryId AS UUID)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingService> findAllWithFilters(@Param("categoryId") String categoryId,
                                         @Param("status") String status, Pageable pageable);
}
