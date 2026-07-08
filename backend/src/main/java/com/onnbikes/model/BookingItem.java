package com.onnbikes.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Individual bike line item in a booking (like items in an Order).
 * Tracks which bike from which station was allocated.
 */
@Entity
@Table(name = "booking_items")
public class BookingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bike_id", nullable = false)
    private Bike bike;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id")
    private RentalStation allocatedStation;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    public BookingItem() {}

    public BookingItem(Booking booking, Bike bike, RentalStation station,
                       Integer quantity, BigDecimal pricePerDay, BigDecimal subtotal) {
        this.booking = booking;
        this.bike = bike;
        this.allocatedStation = station;
        this.quantity = quantity;
        this.pricePerDay = pricePerDay;
        this.subtotal = subtotal;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public Bike getBike() { return bike; }
    public void setBike(Bike bike) { this.bike = bike; }

    public RentalStation getAllocatedStation() { return allocatedStation; }
    public void setAllocatedStation(RentalStation allocatedStation) { this.allocatedStation = allocatedStation; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
}
