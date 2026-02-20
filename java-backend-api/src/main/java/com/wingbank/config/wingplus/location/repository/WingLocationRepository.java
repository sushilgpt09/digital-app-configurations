package com.wingbank.config.wingplus.location.repository;

import com.wingbank.config.wingplus.location.entity.WingLocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WingLocationRepository extends JpaRepository<WingLocation, UUID> {

    List<WingLocation> findByStatusOrderBySortOrder(WingLocation.Status status);

    @Query(value = "SELECT * FROM wing_locations WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) ORDER BY sort_order",
           countQuery = "SELECT COUNT(*) FROM wing_locations WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(name) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<WingLocation> findAllWithFilters(@Param("search") String search,
                                          @Param("status") String status, Pageable pageable);
}
