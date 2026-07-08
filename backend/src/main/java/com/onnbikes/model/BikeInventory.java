package com.onnbikes.model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * BikeInventory tracks how many units of each bike are available at each rental station.
 * This is the core of the inventory management system (like stock map in ZeptoClone).
 */
@Entity
@Table(name = "bike_inventory", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"station_id", "bike_id"})
})
public class BikeInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private RentalStation station;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bike_id", nullable = false)
    private Bike bike;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public BikeInventory() {}

    public BikeInventory(RentalStation station, Bike bike, Integer quantity) {
        this.station = station;
        this.bike = bike;
        this.quantity = quantity;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public RentalStation getStation() { return station; }
    public void setStation(RentalStation station) { this.station = station; }

    public Bike getBike() { return bike; }
    public void setBike(Bike bike) { this.bike = bike; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
