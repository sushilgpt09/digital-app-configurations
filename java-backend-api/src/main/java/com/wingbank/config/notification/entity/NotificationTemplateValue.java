package com.wingbank.config.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "notification_template_values", uniqueConstraints = @UniqueConstraint(columnNames = {"template_id", "language_code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationTemplateValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id", nullable = false)
    private NotificationTemplate notificationTemplate;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(columnDefinition = "TEXT")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;
}
