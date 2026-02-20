package com.wingbank.config.wingplus.banner.entity;

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
@Table(name = "wing_banners")
@SQLRestriction("deleted = false")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WingBanner extends AuditEntity {

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "gradient_from")
    private String gradientFrom;

    @Column(name = "gradient_to")
    private String gradientTo;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @OneToMany(mappedBy = "banner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<WingBannerTranslation> translations = new ArrayList<>();

    public enum Status { ACTIVE, INACTIVE }
}
