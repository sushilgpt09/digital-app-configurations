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

    @Query("SELECT n FROM NotificationTemplate n WHERE " +
           "(:search IS NULL OR LOWER(n.code) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(n.titleEn) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:type IS NULL OR n.type = :type) " +
           "AND (:status IS NULL OR n.status = :status)")
    Page<NotificationTemplate> findAllWithFilters(@Param("search") String search,
                                                    @Param("type") NotificationTemplate.NotificationType type,
                                                    @Param("status") NotificationTemplate.Status status,
                                                    Pageable pageable);
}
