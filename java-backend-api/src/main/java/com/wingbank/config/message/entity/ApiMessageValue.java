package com.wingbank.config.message.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "api_message_values", uniqueConstraints = @UniqueConstraint(columnNames = {"message_id", "language_code"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiMessageValue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", nullable = false)
    private ApiMessage apiMessage;

    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;

    @Column(columnDefinition = "TEXT")
    private String message;
}
