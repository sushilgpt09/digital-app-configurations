package com.wingbank.config.wingplus.location.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "wing_locations")
@SQLRestriction("deleted = false")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class WingLocation extends AuditEntity {

    @Column(nullable = false)
    private String name;

    private String icon;

    @Column(name = "sort_order")
    private int sortOrder = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    public enum Status { ACTIVE, INACTIVE }
}
