package com.wingbank.config.wingplus.popularcard.entity;

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
@Table(name = "wing_popular_cards")
@SQLRestriction("deleted = false")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WingPopularCard extends AuditEntity {

    private String emoji;

    @Column(name = "bg_color")
    private String bgColor;

    @Column(name = "border_color")
    private String borderColor;

    @Column(name = "link_url")
    private String linkUrl;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @OneToMany(mappedBy = "popularCard", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<WingPopularCardTranslation> translations = new ArrayList<>();

    public enum Status { ACTIVE, INACTIVE }
}
