package com.onnbikes.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BookingRequest {

    @NotNull
    private Double userLatitude;

    @NotNull
    private Double userLongitude;

    private String userAddress;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    private String deliveryType = "pickup"; // pickup or doorstep

    private String deliveryAddress;

    @NotEmpty
    private List<BookingItemRequest> items;

    // Getters and Setters
    public Double getUserLatitude() { return userLatitude; }
    public void setUserLatitude(Double userLatitude) { this.userLatitude = userLatitude; }

    public Double getUserLongitude() { return userLongitude; }
    public void setUserLongitude(Double userLongitude) { this.userLongitude = userLongitude; }

    public String getUserAddress() { return userAddress; }
    public void setUserAddress(String userAddress) { this.userAddress = userAddress; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public List<BookingItemRequest> getItems() { return items; }
    public void setItems(List<BookingItemRequest> items) { this.items = items; }

    public static class BookingItemRequest {
        @NotNull
        private String bikeId;

        @NotNull
        private Integer quantity = 1;

        public String getBikeId() { return bikeId; }
        public void setBikeId(String bikeId) { this.bikeId = bikeId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
