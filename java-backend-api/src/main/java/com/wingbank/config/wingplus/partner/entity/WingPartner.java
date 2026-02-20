package com.wingbank.config.wingplus.partner.entity;

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
@Table(name = "wing_partners")
@SQLRestriction("deleted = false")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WingPartner extends AuditEntity {

    private String icon;

    @Column(name = "bg_color")
    private String bgColor;

    private String badge;

    @Column(name = "is_new_partner")
    private boolean isNewPartner = false;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @OneToMany(mappedBy = "partner", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<WingPartnerTranslation> translations = new ArrayList<>();

    public enum Status { ACTIVE, INACTIVE }
}
