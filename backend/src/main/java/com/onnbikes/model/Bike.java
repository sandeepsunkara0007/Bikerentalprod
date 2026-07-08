package com.onnbikes.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "bikes")
public class Bike {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerDay = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean available = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    // Optional: category for grouping (scooter, commuter, sports, cruiser)
    private String category;

    // Engine capacity (e.g., "125cc", "350cc")
    @Column(name = "engine_capacity")
    private String engineCapacity;

    // Fuel type (petrol, electric)
    @Column(name = "fuel_type")
    private String fuelType;

    public Bike() {}

    public Bike(String name, String type, String description, String imageUrl,
                BigDecimal pricePerDay, String category, String engineCapacity, String fuelType) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.imageUrl = imageUrl;
        this.pricePerDay = pricePerDay;
        this.category = category;
        this.engineCapacity = engineCapacity;
        this.fuelType = fuelType;
        this.available = true;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getEngineCapacity() { return engineCapacity; }
    public void setEngineCapacity(String engineCapacity) { this.engineCapacity = engineCapacity; }

    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
}
