package com.wingbank.config.wingplus.popularcard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wing_popular_card_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"popular_card_id", "language_code"}))
@Getter @Setter @NoArgsConstructor
public class WingPopularCardTranslation {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "popular_card_id", nullable = false)
    private WingPopularCard popularCard;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    private String title;
    private String subtitle;
}
