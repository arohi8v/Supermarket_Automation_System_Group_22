package com.snumart.supermarket.supermarket.repository;

import com.snumart.supermarket.supermarket.model.StoreLayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreLayoutRepository extends JpaRepository<StoreLayout, Long> {
    StoreLayout findByName(String name);
}
