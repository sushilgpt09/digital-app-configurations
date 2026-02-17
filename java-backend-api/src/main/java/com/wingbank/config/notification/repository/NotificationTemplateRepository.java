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

    @Query(value = "SELECT * FROM notification_templates WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(title_en) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR type = CAST(:type AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           countQuery = "SELECT COUNT(*) FROM notification_templates WHERE deleted = false " +
           "AND (:search IS NULL OR LOWER(code) LIKE LOWER('%' || CAST(:search AS TEXT) || '%') " +
           "OR LOWER(title_en) LIKE LOWER('%' || CAST(:search AS TEXT) || '%')) " +
           "AND (:type IS NULL OR type = CAST(:type AS TEXT)) " +
           "AND (:status IS NULL OR status = CAST(:status AS TEXT))",
           nativeQuery = true)
    Page<NotificationTemplate> findAllWithFilters(@Param("search") String search,
                                                    @Param("type") String type,
                                                    @Param("status") String status,
                                                    Pageable pageable);
}
