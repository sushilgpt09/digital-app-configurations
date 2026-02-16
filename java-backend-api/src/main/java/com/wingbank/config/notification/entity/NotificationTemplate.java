package com.wingbank.config.notification.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "notification_templates")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplate extends AuditEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "title_en")
    private String titleEn;

    @Column(name = "title_km")
    private String titleKm;

    @Column(name = "body_en")
    private String bodyEn;

    @Column(name = "body_km")
    private String bodyKm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type = NotificationType.PUSH;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public enum NotificationType {
        PUSH, SMS, EMAIL
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}
