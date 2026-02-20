package com.wingbank.config.wingplus.partner.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wing_partner_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"partner_id", "language_code"}))
@Getter @Setter @NoArgsConstructor
public class WingPartnerTranslation {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "partner_id", nullable = false)
    private WingPartner partner;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    @Column(nullable = false)
    private String name;

    private String description;
}
