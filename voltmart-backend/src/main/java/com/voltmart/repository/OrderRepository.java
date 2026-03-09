package com.voltmart.repository;

import com.voltmart.entity.Order;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerPhone(String customerPhone);
}
