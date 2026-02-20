package com.wingbank.config.wingplus.banner.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wing_banner_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"banner_id", "language_code"}))
@Getter @Setter @NoArgsConstructor
public class WingBannerTranslation {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "banner_id", nullable = false)
    private WingBanner banner;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    private String title;
    private String subtitle;

    @Column(name = "offer_text")
    private String offerText;
}
