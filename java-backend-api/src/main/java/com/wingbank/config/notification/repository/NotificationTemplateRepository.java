package com.wingbank.config.notification.repository;

import com.wingbank.config.notification.entity.NotificationTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationTemplateRepository extends JpaRepository<NotificationTemplate, UUID> {

    boolean existsByCode(String code);

    List<NotificationTemplate> findByType(NotificationTemplate.NotificationType type);

    List<NotificationTemplate> findByStatus(NotificationTemplate.Status status);

    @Query(value = "SELECT DISTINCT n.* FROM notification_templates n " +
           "LEFT JOIN notification_template_values nv ON n.id = nv.template_id " +
           "WHERE n.deleted = false " +
           "AND (:search IS NULL OR LOWER(n.code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(nv.title) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR n.type = CAST(:type AS TEXT)) " +
           "AND (:status IS NULL OR n.status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(DISTINCT n.id) FROM notification_templates n " +
           "LEFT JOIN notification_template_values nv ON n.id = nv.template_id " +
           "WHERE n.deleted = false " +
           "AND (:search IS NULL OR LOWER(n.code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(nv.title) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR n.type = CAST(:type AS TEXT)) " +
           "AND (:status IS NULL OR n.status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<NotificationTemplate> findAllWithFilters(@Param("search") String search,
                                                    @Param("type") String type,
                                                    @Param("status") String status,
                                                    Pageable pageable);
}
