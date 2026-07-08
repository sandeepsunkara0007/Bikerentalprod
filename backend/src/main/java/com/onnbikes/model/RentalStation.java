package com.onnbikes.model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * RentalStation represents a physical location (like DarkStore in ZeptoClone)
 * where bikes are stored and available for pickup.
 */
@Entity
@Table(name = "rental_stations")
public class RentalStation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "city", nullable = false)
    private String city = "Pune";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "opening_time")
    private String openingTime = "06:00";

    @Column(name = "closing_time")
    private String closingTime = "22:00";

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public RentalStation() {}

    public RentalStation(String name, String address, Double latitude, Double longitude, String city) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.city = city;
        this.isActive = true;
        this.createdAt = Instant.now();
    }

    /**
     * Calculate Euclidean distance to a user's location.
     * In production, use Haversine formula for geographic coordinates.
     */
    public double distanceTo(double userLat, double userLng) {
        return Math.sqrt(Math.pow(this.latitude - userLat, 2)
                       + Math.pow(this.longitude - userLng, 2));
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getOpeningTime() { return openingTime; }
    public void setOpeningTime(String openingTime) { this.openingTime = openingTime; }

    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
