package com.wingbank.config.wingplus.wingservice.entity;

import com.wingbank.config.common.audit.AuditEntity;
import com.wingbank.config.wingplus.category.entity.WingCategory;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private WingCategory category;

    private String icon;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<WingServiceTranslation> translations = new ArrayList<>();

    public enum Status { ACTIVE, INACTIVE }
}
