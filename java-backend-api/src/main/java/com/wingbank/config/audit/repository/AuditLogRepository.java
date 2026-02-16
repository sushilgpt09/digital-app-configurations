package com.wingbank.config.audit.repository;

import com.wingbank.config.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:search IS NULL OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.action) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(a.entityType) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:entityType IS NULL OR a.entityType = :entityType) " +
           "AND (:action IS NULL OR a.action = :action) " +
           "AND (:from IS NULL OR a.createdAt >= :from) " +
           "AND (:to IS NULL OR a.createdAt <= :to) " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> findAllWithFilters(@Param("search") String search,
                                       @Param("entityType") String entityType,
                                       @Param("action") String action,
                                       @Param("from") LocalDateTime from,
                                       @Param("to") LocalDateTime to,
                                       Pageable pageable);
}
