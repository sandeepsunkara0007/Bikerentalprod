package com.onnbikes.repository;

import com.onnbikes.model.BikeInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BikeInventoryRepository extends JpaRepository<BikeInventory, String> {

    Optional<BikeInventory> findByStationIdAndBikeId(String stationId, String bikeId);

    List<BikeInventory> findByStationId(String stationId);

    List<BikeInventory> findByBikeId(String bikeId);

    @Query("SELECT bi FROM BikeInventory bi WHERE bi.station.id IN :stationIds AND bi.quantity > 0")
    List<BikeInventory> findAvailableInventoryByStations(@Param("stationIds") List<String> stationIds);

    @Query("SELECT bi FROM BikeInventory bi WHERE bi.station.id = :stationId AND bi.quantity > 0")
    List<BikeInventory> findAvailableByStationId(@Param("stationId") String stationId);
}
