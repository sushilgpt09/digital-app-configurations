package com.wingbank.config.wingplus.wingservice.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wing_services")
@SQLRestriction("deleted = false")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WingService extends AuditEntity {

    @Column(name = "category_id")
    private java.util.UUID categoryId;

    @Column(name = "location_id")
    private java.util.UUID locationId;

    private String icon;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_popular")
    private boolean isPopular = false;

    @Column(name = "is_new")
    private boolean isNew = false;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    // Popular Partners display config
    @Column(name = "popular_sort_order")
    private int popularSortOrder = 0;

    @Column(name = "popular_emoji")
    private String popularEmoji;

    @Column(name = "popular_bg_color")
    private String popularBgColor;

    @Column(name = "popular_border_color")
    private String popularBorderColor;

    // New Partners display config
    @Column(name = "new_sort_order")
    private int newSortOrder = 0;

    @Column(name = "new_bg_color")
    private String newBgColor;

    @Column(name = "new_border_color")
    private String newBorderColor;

    @Column(name = "new_badge")
    private String newBadge;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<WingServiceTranslation> translations = new ArrayList<>();

    public enum Status { ACTIVE, INACTIVE }
}
