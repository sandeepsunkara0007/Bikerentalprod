package com.onnbikes.controller;

import com.onnbikes.dto.BookingRequest;
import com.onnbikes.dto.BookingResponse;
import com.onnbikes.service.RentalAllocationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final RentalAllocationService allocationService;

    public BookingController(RentalAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            Principal principal,
            @Valid @RequestBody BookingRequest request) {

        String userId = principal != null ? principal.getName() : "anonymous";
        String userName = principal != null ? principal.getName() : "Guest";

        BookingResponse response = allocationService.placeBooking(userId, userName, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Principal principal) {
        String userId = principal != null ? principal.getName() : "anonymous";
        return ResponseEntity.ok(allocationService.getUserBookings(userId));
    }
}
