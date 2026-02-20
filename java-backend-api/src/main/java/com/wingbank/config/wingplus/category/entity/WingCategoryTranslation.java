package com.wingbank.config.wingplus.category.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "wing_category_translations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"category_id", "language_code"}))
@Getter @Setter @NoArgsConstructor
public class WingCategoryTranslation {

    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private WingCategory category;

    @Column(name = "language_code", nullable = false)
    private String languageCode;

    private String name;

    @Column(name = "display_name")
    private String displayName;
}
