package com.onnbikes.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class BookingResponse {
    private String id;
    private String userId;
    private String userName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private String status;
    private String deliveryType;
    private String deliveryAddress;
    private List<BookingItemResponse> items;
    private List<String> deliveryPartners;
    private String createdAt;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

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

    public List<BookingItemResponse> getItems() { return items; }
    public void setItems(List<BookingItemResponse> items) { this.items = items; }

    public List<String> getDeliveryPartners() { return deliveryPartners; }
    public void setDeliveryPartners(List<String> deliveryPartners) { this.deliveryPartners = deliveryPartners; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public static class BookingItemResponse {
        private String bikeId;
        private String bikeName;
        private String bikeImage;
        private String stationName;
        private String stationAddress;
        private Integer quantity;
        private BigDecimal pricePerDay;
        private BigDecimal subtotal;

        public String getBikeId() { return bikeId; }
        public void setBikeId(String bikeId) { this.bikeId = bikeId; }

        public String getBikeName() { return bikeName; }
        public void setBikeName(String bikeName) { this.bikeName = bikeName; }

        public String getBikeImage() { return bikeImage; }
        public void setBikeImage(String bikeImage) { this.bikeImage = bikeImage; }

        public String getStationName() { return stationName; }
        public void setStationName(String stationName) { this.stationName = stationName; }

        public String getStationAddress() { return stationAddress; }
        public void setStationAddress(String stationAddress) { this.stationAddress = stationAddress; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public BigDecimal getPricePerDay() { return pricePerDay; }
        public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }

        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    }
}
