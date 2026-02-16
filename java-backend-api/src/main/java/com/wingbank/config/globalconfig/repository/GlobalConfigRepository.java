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

    @Query("SELECT g FROM GlobalConfig g WHERE " +
           "(:search IS NULL OR LOWER(g.configKey) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(g.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:platform IS NULL OR g.platform = :platform) " +
           "AND (:status IS NULL OR g.status = :status)")
    Page<GlobalConfig> findAllWithFilters(@Param("search") String search,
                                           @Param("platform") String platform,
                                           @Param("status") GlobalConfig.Status status,
                                           Pageable pageable);
}
