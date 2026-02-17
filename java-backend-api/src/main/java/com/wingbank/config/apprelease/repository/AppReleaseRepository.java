package com.wingbank.config.apprelease.repository;

import com.wingbank.config.apprelease.entity.AppRelease;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AppReleaseRepository extends JpaRepository<AppRelease, UUID> {

    @Query(value = "SELECT * FROM app_releases WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(version) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT)) " +
           "ORDER BY released_at DESC NULLS LAST, created_at DESC",
           countQuery = "SELECT COUNT(*) FROM app_releases WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(version) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<AppRelease> findAllWithFilters(@Param("search") String search,
                                        @Param("platform") String platform,
                                        @Param("status") String status,
                                        Pageable pageable);
}
