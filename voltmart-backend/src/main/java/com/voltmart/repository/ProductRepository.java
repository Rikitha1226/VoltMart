package com.voltmart.repository;

import com.voltmart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {


List<Product> findByStockLessThan(int stock);

List<Product> findByNameContainingIgnoreCase(String name);
}
