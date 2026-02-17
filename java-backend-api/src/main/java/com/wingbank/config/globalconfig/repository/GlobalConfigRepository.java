package com.wingbank.config.globalconfig.repository;

import com.wingbank.config.globalconfig.entity.GlobalConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GlobalConfigRepository extends JpaRepository<GlobalConfig, UUID> {

    @Query("SELECT g FROM GlobalConfig g WHERE " +
           "(g.platform = :platform OR g.platform = 'ALL') " +
           "AND g.status = 'ACTIVE'")
    List<GlobalConfig> findByPlatformActive(@Param("platform") String platform);

    @Query(value = "SELECT * FROM global_configs WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(config_key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(description) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM global_configs WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(config_key) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(description) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:platform IS NULL OR platform = CAST(:platform AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<GlobalConfig> findAllWithFilters(@Param("search") String search,
                                           @Param("platform") String platform,
                                           @Param("status") String status,
                                           Pageable pageable);
}
