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

    List<WingService> findByStatusOrderBySortOrder(WingService.Status status);

    List<WingService> findByCategoryIdAndStatusOrderBySortOrder(UUID categoryId, WingService.Status status);

    List<WingService> findByIsPopularAndStatusOrderByPopularSortOrder(boolean isPopular, WingService.Status status);

    List<WingService> findByIsPopularAndStatusAndLocationIdOrderByPopularSortOrder(boolean isPopular, WingService.Status status, UUID locationId);

    List<WingService> findByIsNewAndStatusOrderByNewSortOrder(boolean isNew, WingService.Status status);

    List<WingService> findByIsNewAndStatusAndLocationIdOrderByNewSortOrder(boolean isNew, WingService.Status status, UUID locationId);

    @Query(value = "SELECT * FROM wing_services WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) " +
           "ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_services WHERE deleted = false " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingService> findAllWithFilters(@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT * FROM wing_services WHERE deleted = false AND is_popular = true " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) " +
           "ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_services WHERE deleted = false AND is_popular = true " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingService> findAllPopularWithFilters(@Param("status") String status, Pageable pageable);

    @Query(value = "SELECT * FROM wing_services WHERE deleted = false AND is_new = true " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) " +
           "ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_services WHERE deleted = false AND is_new = true " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingService> findAllNewWithFilters(@Param("status") String status, Pageable pageable);
}
