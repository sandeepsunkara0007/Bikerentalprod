package com.onnbikes.repository;

import com.onnbikes.model.Bike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BikeRepository extends JpaRepository<Bike, String> {
    List<Bike> findByAvailableTrue();
    List<Bike> findByType(String type);
    List<Bike> findByCategory(String category);
}
