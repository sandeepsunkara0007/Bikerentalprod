package com.onnbikes.service;

import com.onnbikes.dto.BookingRequest;
import com.onnbikes.dto.BookingResponse;
import com.onnbikes.model.*;
import com.onnbikes.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * RentalAllocationService implements the ZeptoClone-style allocation logic:
 * 1. Find nearby rental stations within search radius
 * 2. Check if the closest station has all requested bikes
 * 3. If yes, allocate all from one station with one partner
 * 4. If no, split across multiple nearby stations with multiple partners
 */
@Service
public class RentalAllocationService {

    private static final Logger log = LoggerFactory.getLogger(RentalAllocationService.class);

    private final BikeRepository bikeRepository;
    private final RentalStationRepository stationRepository;
    private final BikeInventoryRepository inventoryRepository;
    private final BookingRepository bookingRepository;

    @Value("${app.rental.default-search-radius:5.0}")
    private double defaultSearchRadius;

    public RentalAllocationService(BikeRepository bikeRepository,
                                    RentalStationRepository stationRepository,
                                    BikeInventoryRepository inventoryRepository,
                                    BookingRepository bookingRepository) {
        this.bikeRepository = bikeRepository;
        this.stationRepository = stationRepository;
        this.inventoryRepository = inventoryRepository;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Main method to place a booking (like OrderManager.placeOrder in ZeptoClone).
     * Finds nearby stations, allocates bikes, assigns delivery partners.
     */
    @Transactional
    public BookingResponse placeBooking(String userId, String userName, BookingRequest request) {
        log.info("[RentalAllocation] Placing booking for user: {} at ({}, {})",
                 userName, request.getUserLatitude(), request.getUserLongitude());

        // 1) Find nearby rental stations within default search radius
        double rangeDeg = defaultSearchRadius / 111.0; // Approx conversion: 1 deg ≈ 111 km
        List<RentalStation> nearbyStations = stationRepository.findNearbyStations(
                request.getUserLatitude(), request.getUserLongitude(), rangeDeg);

        // Sort by distance (closest first)
        nearbyStations.sort(Comparator.comparingDouble(
                s -> s.distanceTo(request.getUserLatitude(), request.getUserLongitude())));

        if (nearbyStations.isEmpty()) {
            log.warn("  No rental stations within {} KM. Cannot fulfill booking.", defaultSearchRadius);
            throw new IllegalStateException(
                    "No rental stations found within " + defaultSearchRadius + " KM of your location.");
        }

        log.info("  Found {} nearby stations", nearbyStations.size());
        for (RentalStation s : nearbyStations) {
            log.info("    - {} (dist: {:.2f})", s.getName(),
                     s.distanceTo(request.getUserLatitude(), request.getUserLongitude()));
        }

        // Build a map of requested items: bikeId -> quantity
        Map<String, Integer> requestedItems = new HashMap<>();
        Map<String, Bike> requestedBikes = new HashMap<>();
        for (BookingRequest.BookingItemRequest item : request.getItems()) {
            Bike bike = bikeRepository.findById(item.getBikeId())
                    .orElseThrow(() -> new IllegalArgumentException("Bike not found: " + item.getBikeId()));
            requestedItems.put(item.getBikeId(), item.getQuantity());
            requestedBikes.put(item.getBikeId(), bike);
        }

        // Calculate number of rental days
        long rentalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (rentalDays <= 0) rentalDays = 1;

        // 2) Check if closest station has all items (like ZeptoClone)
        RentalStation firstStation = nearbyStations.get(0);
        boolean allInFirst = canFulfillFromStation(firstStation, requestedItems);

        // Create the booking
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setUserName(userName);
        booking.setUserLatitude(request.getUserLatitude());
        booking.setUserLongitude(request.getUserLongitude());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setDeliveryType(request.getDeliveryType());
        booking.setDeliveryAddress(request.getDeliveryAddress());
        booking.setStatus("confirmed");

        List<BookingResponse.BookingItemResponse> itemResponses = new ArrayList<>();
        List<String> partnerNames = new ArrayList<>();

        if (allInFirst) {
            // 3) All items available at the closest station — single allocation
            log.info("  All items available at: {}", firstStation.getName());
            allocateFromStation(booking, firstStation, requestedItems, requestedBikes,
                    rentalDays, itemResponses);

            String partnerName = "Partner-" + firstStation.getName();
            BookingDeliveryPartner partner = new BookingDeliveryPartner(booking, partnerName);
            booking.getDeliveryPartners().add(partner);
            partnerNames.add(partnerName);
            log.info("  Assigned Delivery Partner: {}", partnerName);

        } else {
            // 4) Split across multiple nearby stations (like multi-store order in ZeptoClone)
            log.info("  Splitting booking across nearby stations...");
            Map<String, Integer> remainingItems = new HashMap<>(requestedItems);

            int partnerId = 1;
            for (RentalStation station : nearbyStations) {
                if (remainingItems.isEmpty()) break;

                log.info("   Checking: {}", station.getName());
                Map<String, Integer> stationAllocation = new HashMap<>();

                for (Map.Entry<String, Integer> entry : new HashMap<>(remainingItems).entrySet()) {
                    String bikeId = entry.getKey();
                    int qtyNeeded = entry.getValue();

                    Optional<BikeInventory> invOpt = inventoryRepository
                            .findByStationIdAndBikeId(station.getId(), bikeId);

                    if (invOpt.isEmpty() || invOpt.get().getQuantity() <= 0) continue;

                    int availableQty = invOpt.get().getQuantity();
                    int takenQty = Math.min(availableQty, qtyNeeded);

                    // Deduct from inventory
                    invOpt.get().setQuantity(availableQty - takenQty);
                    inventoryRepository.save(invOpt.get());

                    // Create booking item
                    Bike bike = requestedBikes.get(bikeId);
                    BigDecimal subtotal = bike.getPricePerDay()
                            .multiply(BigDecimal.valueOf(takenQty))
                            .multiply(BigDecimal.valueOf(rentalDays));

                    BookingItem bookingItem = new BookingItem(
                            booking, bike, station, takenQty,
                            bike.getPricePerDay(), subtotal);
                    booking.getItems().add(bookingItem);

                    BookingResponse.BookingItemResponse ir = new BookingResponse.BookingItemResponse();
                    ir.setBikeId(bikeId);
                    ir.setBikeName(bike.getName());
                    ir.setBikeImage(bike.getImageUrl());
                    ir.setStationName(station.getName());
                    ir.setStationAddress(station.getAddress());
                    ir.setQuantity(takenQty);
                    ir.setPricePerDay(bike.getPricePerDay());
                    ir.setSubtotal(subtotal);
                    itemResponses.add(ir);

                    log.info("     {} supplies {} x{}", station.getName(), bike.getName(), takenQty);
                    stationAllocation.put(bikeId, takenQty);

                    int remaining = qtyNeeded - takenQty;
                    if (remaining > 0) {
                        remainingItems.put(bikeId, remaining);
                    } else {
                        remainingItems.remove(bikeId);
                    }
                }

                if (!stationAllocation.isEmpty()) {
                    String partnerName = "Partner" + (partnerId++) + "-" + station.getName();
                    BookingDeliveryPartner partner = new BookingDeliveryPartner(booking, partnerName);
                    booking.getDeliveryPartners().add(partner);
                    partnerNames.add(partnerName);
                    log.info("     Assigned: {} for {}", partnerName, station.getName());
                }
            }

            if (!remainingItems.isEmpty()) {
                log.warn("  Could not fulfill all items:");
                for (Map.Entry<String, Integer> entry : remainingItems.entrySet()) {
                    Bike b = requestedBikes.get(entry.getKey());
                    log.warn("    {} x{} - insufficient stock nearby", b.getName(), entry.getValue());
                }
            }
        }

        // Calculate total
        BigDecimal total = BigDecimal.ZERO;
        for (BookingItem bi : booking.getItems()) {
            total = total.add(bi.getSubtotal());
        }
        booking.setTotalPrice(total);

        // Save booking
        Booking saved = bookingRepository.save(booking);
        log.info("[RentalAllocation] Booking #{} created for {} | Total: ₹{}",
                 saved.getId(), userName, total);

        return buildResponse(saved, itemResponses, partnerNames);
    }

    /**
     * Check if a single station can fulfill all requested items (like ZeptoClone's allInFirst check).
     */
    private boolean canFulfillFromStation(RentalStation station, Map<String, Integer> requestedItems) {
        for (Map.Entry<String, Integer> entry : requestedItems.entrySet()) {
            String bikeId = entry.getKey();
            int qtyNeeded = entry.getValue();

            Optional<BikeInventory> invOpt = inventoryRepository
                    .findByStationIdAndBikeId(station.getId(), bikeId);

            if (invOpt.isEmpty() || invOpt.get().getQuantity() < qtyNeeded) {
                return false;
            }
        }
        return true;
    }

    /**
     * Allocate all items from a single station.
     */
    private void allocateFromStation(Booking booking, RentalStation station,
                                      Map<String, Integer> requestedItems,
                                      Map<String, Bike> requestedBikes,
                                      long rentalDays,
                                      List<BookingResponse.BookingItemResponse> itemResponses) {
        for (Map.Entry<String, Integer> entry : requestedItems.entrySet()) {
            String bikeId = entry.getKey();
            int qty = entry.getValue();

            // Deduct inventory
            BikeInventory inv = inventoryRepository
                    .findByStationIdAndBikeId(station.getId(), bikeId)
                    .orElseThrow(() -> new IllegalStateException("Inventory not found for bike " + bikeId));
            inv.setQuantity(inv.getQuantity() - qty);
            inventoryRepository.save(inv);

            // Create booking item
            Bike bike = requestedBikes.get(bikeId);
            BigDecimal subtotal = bike.getPricePerDay()
                    .multiply(BigDecimal.valueOf(qty))
                    .multiply(BigDecimal.valueOf(rentalDays));

            BookingItem bookingItem = new BookingItem(
                    booking, bike, station, qty,
                    bike.getPricePerDay(), subtotal);
            booking.getItems().add(bookingItem);

            BookingResponse.BookingItemResponse ir = new BookingResponse.BookingItemResponse();
            ir.setBikeId(bikeId);
            ir.setBikeName(bike.getName());
            ir.setBikeImage(bike.getImageUrl());
            ir.setStationName(station.getName());
            ir.setStationAddress(station.getAddress());
            ir.setQuantity(qty);
            ir.setPricePerDay(bike.getPricePerDay());
            ir.setSubtotal(subtotal);
            itemResponses.add(ir);
        }
    }

    private BookingResponse buildResponse(Booking booking,
                                           List<BookingResponse.BookingItemResponse> items,
                                           List<String> partners) {
        BookingResponse resp = new BookingResponse();
        resp.setId(booking.getId());
        resp.setUserId(booking.getUserId());
        resp.setUserName(booking.getUserName());
        resp.setStartDate(booking.getStartDate());
        resp.setEndDate(booking.getEndDate());
        resp.setTotalPrice(booking.getTotalPrice());
        resp.setStatus(booking.getStatus());
        resp.setDeliveryType(booking.getDeliveryType());
        resp.setDeliveryAddress(booking.getDeliveryAddress());
        resp.setItems(items);
        resp.setDeliveryPartners(partners);
        resp.setCreatedAt(booking.getCreatedAt().toString());
        return resp;
    }

    /**
     * Get available bikes at nearby stations (like ZeptoHelper.showAllItems).
     */
    public List<Map<String, Object>> getAvailableBikesNearby(double userLat, double userLng) {
        double rangeDeg = defaultSearchRadius / 111.0;
        List<RentalStation> nearbyStations = stationRepository.findNearbyStations(
                userLat, userLng, rangeDeg);

        List<String> stationIds = nearbyStations.stream()
                .map(RentalStation::getId)
                .collect(Collectors.toList());

        List<BikeInventory> inventories = inventoryRepository.findAvailableInventoryByStations(stationIds);

        // Deduplicate by bike
        Map<String, Map<String, Object>> bikeMap = new LinkedHashMap<>();
        for (BikeInventory inv : inventories) {
            Bike bike = inv.getBike();
            if (!bikeMap.containsKey(bike.getId())) {
                Map<String, Object> bikeInfo = new LinkedHashMap<>();
                bikeInfo.put("id", bike.getId());
                bikeInfo.put("name", bike.getName());
                bikeInfo.put("type", bike.getType());
                bikeInfo.put("category", bike.getCategory());
                bikeInfo.put("description", bike.getDescription());
                bikeInfo.put("imageUrl", bike.getImageUrl());
                bikeInfo.put("pricePerDay", bike.getPricePerDay());
                bikeInfo.put("engineCapacity", bike.getEngineCapacity());
                bikeInfo.put("fuelType", bike.getFuelType());
                bikeInfo.put("availableQuantity", inv.getQuantity());
                bikeInfo.put("stationId", inv.getStation().getId());
                bikeInfo.put("stationName", inv.getStation().getName());
                bikeMap.put(bike.getId(), bikeInfo);
            }
        }

        return new ArrayList<>(bikeMap.values());
    }

    /**
     * Get user's booking history.
     */
    public List<BookingResponse> getUserBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        List<BookingResponse> responses = new ArrayList<>();

        for (Booking b : bookings) {
            List<BookingResponse.BookingItemResponse> items = new ArrayList<>();
            for (BookingItem bi : b.getItems()) {
                BookingResponse.BookingItemResponse ir = new BookingResponse.BookingItemResponse();
                ir.setBikeId(bi.getBike().getId());
                ir.setBikeName(bi.getBike().getName());
                ir.setBikeImage(bi.getBike().getImageUrl());
                ir.setStationName(bi.getAllocatedStation() != null ? bi.getAllocatedStation().getName() : null);
                ir.setQuantity(bi.getQuantity());
                ir.setPricePerDay(bi.getPricePerDay());
                ir.setSubtotal(bi.getSubtotal());
                items.add(ir);
            }

            List<String> partners = b.getDeliveryPartners().stream()
                    .map(BookingDeliveryPartner::getPartnerName)
                    .collect(Collectors.toList());

            responses.add(buildResponse(b, items, partners));
        }

        return responses;
    }

    /**
     * Get all rental stations.
     */
    public List<RentalStation> getAllStations() {
        return stationRepository.findByIsActiveTrue();
    }

    /**
     * Get all bikes.
     */
    public List<Bike> getAllBikes() {
        return bikeRepository.findByAvailableTrue();
    }
}
