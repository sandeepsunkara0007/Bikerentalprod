package com.onnbikes.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking represents a rental order (like Order in ZeptoClone).
 * It tracks which bikes are rented, from which station, and delivery partners.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_latitude")
    private Double userLatitude;

    @Column(name = "user_longitude")
    private Double userLongitude;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(nullable = false)
    private String status = "confirmed"; // confirmed, active, completed, cancelled

    @Column(name = "delivery_type")
    private String deliveryType = "pickup"; // pickup or doorstep

    @Column(name = "delivery_address")
    private String deliveryAddress;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingDeliveryPartner> deliveryPartners = new ArrayList<>();

    public Booking() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public Double getUserLatitude() { return userLatitude; }
    public void setUserLatitude(Double userLatitude) { this.userLatitude = userLatitude; }

    public Double getUserLongitude() { return userLongitude; }
    public void setUserLongitude(Double userLongitude) { this.userLongitude = userLongitude; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public List<BookingItem> getItems() { return items; }
    public void setItems(List<BookingItem> items) { this.items = items; }

    public List<BookingDeliveryPartner> getDeliveryPartners() { return deliveryPartners; }
    public void setDeliveryPartners(List<BookingDeliveryPartner> deliveryPartners) { this.deliveryPartners = deliveryPartners; }
}
