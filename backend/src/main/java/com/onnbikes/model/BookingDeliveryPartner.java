package com.onnbikes.model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Delivery partner assigned to a booking (like DeliveryPartner in ZeptoClone).
 * For doorstep delivery of bikes.
 */
@Entity
@Table(name = "booking_delivery_partners")
public class BookingDeliveryPartner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "partner_name", nullable = false)
    private String partnerName;

    @Column(name = "partner_phone")
    private String partnerPhone;

    @Column(name = "assigned_at", nullable = false)
    private Instant assignedAt = Instant.now();

    public BookingDeliveryPartner() {}

    public BookingDeliveryPartner(Booking booking, String partnerName) {
        this.booking = booking;
        this.partnerName = partnerName;
        this.assignedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public String getPartnerName() { return partnerName; }
    public void setPartnerName(String partnerName) { this.partnerName = partnerName; }

    public String getPartnerPhone() { return partnerPhone; }
    public void setPartnerPhone(String partnerPhone) { this.partnerPhone = partnerPhone; }

    public Instant getAssignedAt() { return assignedAt; }
    public void setAssignedAt(Instant assignedAt) { this.assignedAt = assignedAt; }
}
