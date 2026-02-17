package com.wingbank.config.apprelease.entity;

import com.wingbank.config.common.audit.AuditEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "app_releases")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppRelease extends AuditEntity {

    @Column(nullable = false)
    private String version;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Platform platform;

    @Column(name = "release_notes", length = 2000)
    private String releaseNotes;

    @Column(name = "build_number")
    private String buildNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ACTIVE;

    @Column(name = "force_update", nullable = false)
    private boolean forceUpdate = false;

    @Column(name = "min_os_version")
    private String minOsVersion;

    @Column(name = "download_url")
    private String downloadUrl;

    @Column(name = "released_at")
    private LocalDate releasedAt;

    public enum Platform {
        ANDROID, IOS, HUAWEI
    }

    public enum Status {
        ACTIVE, INACTIVE
    }
}
