package com.onnbikes.controller;

import com.onnbikes.model.Bike;
import com.onnbikes.model.RentalStation;
import com.onnbikes.service.RentalAllocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bikes")
@CrossOrigin(origins = "*")
public class BikeController {

    private final RentalAllocationService allocationService;

    public BikeController(RentalAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @GetMapping
    public ResponseEntity<List<Bike>> getAllBikes() {
        return ResponseEntity.ok(allocationService.getAllBikes());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Map<String, Object>>> getBikesNearby(
            @RequestParam double lat,
            @RequestParam double lng) {
        return ResponseEntity.ok(allocationService.getAvailableBikesNearby(lat, lng));
    }

    @GetMapping("/stations")
    public ResponseEntity<List<RentalStation>> getAllStations() {
        return ResponseEntity.ok(allocationService.getAllStations());
    }
}
