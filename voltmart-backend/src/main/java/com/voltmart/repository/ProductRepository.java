package com.voltmart.repository;

import com.voltmart.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStockLessThan(int stock);

    List<Product> findByNameContainingIgnoreCase(String name);
}
