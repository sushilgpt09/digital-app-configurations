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

    @Query(value = "SELECT * FROM audit_logs WHERE " +
           "(:search IS NULL OR LOWER(user_email) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(action) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(entity_type) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:entityType IS NULL OR entity_type = CAST(:entityType AS TEXT)) " +
           "AND (:action IS NULL OR action = CAST(:action AS TEXT)) " +
           "AND (CAST(:fromDate AS TIMESTAMP) IS NULL OR created_at >= CAST(:fromDate AS TIMESTAMP)) " +
           "AND (CAST(:toDate AS TIMESTAMP) IS NULL OR created_at <= CAST(:toDate AS TIMESTAMP)) " +
           "ORDER BY created_at DESC",
           countQuery = "SELECT COUNT(*) FROM audit_logs WHERE " +
           "(:search IS NULL OR LOWER(user_email) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(action) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(entity_type) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:entityType IS NULL OR entity_type = CAST(:entityType AS TEXT)) " +
           "AND (:action IS NULL OR action = CAST(:action AS TEXT)) " +
           "AND (CAST(:fromDate AS TIMESTAMP) IS NULL OR created_at >= CAST(:fromDate AS TIMESTAMP)) " +
           "AND (CAST(:toDate AS TIMESTAMP) IS NULL OR created_at <= CAST(:toDate AS TIMESTAMP))",
           nativeQuery = true)
    Page<AuditLog> findAllWithFilters(@Param("search") String search,
                                       @Param("entityType") String entityType,
                                       @Param("action") String action,
                                       @Param("fromDate") LocalDateTime from,
                                       @Param("toDate") LocalDateTime to,
                                       Pageable pageable);
}
