package com.wingbank.config.wingplus.category.repository;

import com.wingbank.config.wingplus.category.entity.WingCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WingCategoryRepository extends JpaRepository<WingCategory, UUID> {

    boolean existsByKey(String key);

    List<WingCategory> findByStatusOrderBySortOrder(WingCategory.Status status);

    @Query(value = "SELECT * FROM wing_categories WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_categories WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingCategory> findAllWithFilters(@Param("search") String search,
                                          @Param("status") String status, Pageable pageable);
}
