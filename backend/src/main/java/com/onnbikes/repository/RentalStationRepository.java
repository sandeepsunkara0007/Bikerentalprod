package com.onnbikes.repository;

import com.onnbikes.model.RentalStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RentalStationRepository extends JpaRepository<RentalStation, String> {

    List<RentalStation> findByCityAndIsActiveTrue(String city);

    List<RentalStation> findByIsActiveTrue();

    /**
     * Find active stations within a bounding box approximation.
     * For production, use PostGIS or a more sophisticated geo query.
     */
    @Query(value = "SELECT * FROM rental_stations WHERE is_active = true " +
           "AND ABS(latitude - :lat) < :rangeDeg AND ABS(longitude - :lng) < :rangeDeg",
           nativeQuery = true)
    List<RentalStation> findNearbyStations(@Param("lat") double lat,
                                           @Param("lng") double lng,
                                           @Param("rangeDeg") double rangeDeg);
}
