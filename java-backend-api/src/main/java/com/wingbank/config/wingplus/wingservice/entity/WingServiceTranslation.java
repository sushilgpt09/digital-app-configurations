package com.wingbank.config.wingplus.wingservice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wing_service_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"service_id", "language_code"}))
@Getter @Setter @NoArgsConstructor
public class WingServiceTranslation {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private WingService service;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    @Column(nullable = false)
    private String title;

    private String description;
}
