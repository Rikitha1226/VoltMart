package com.voltmart.service;

import com.voltmart.entity.Order;
import com.voltmart.entity.OrderItem;
import com.voltmart.entity.Product;
import com.voltmart.repository.OrderItemRepository;
import com.voltmart.repository.OrderRepository;
import com.voltmart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {


private final OrderRepository orderRepository;
private final OrderItemRepository orderItemRepository;
private final ProductRepository productRepository;

public OrderService(OrderRepository orderRepository,
                    OrderItemRepository orderItemRepository,
                    ProductRepository productRepository) {
    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.productRepository = productRepository;
}

public Order createOrder(String phone, List<OrderItem> items) {

    Order order = new Order();
    order.setCustomerPhone(phone);

    double total = 0;

    order = orderRepository.save(order);

    for (OrderItem item : items) {

        Product product = productRepository.findById(item.getProductId()).orElse(null);

        if (product != null) {

            double price = product.getPrice() * item.getQuantity();

            item.setOrderId(order.getId());
            item.setPrice(price);

            orderItemRepository.save(item);

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            total += price;
        }
    }

    order.setTotalAmount(total);
    return orderRepository.save(order);
}

public List<Order> getOrdersByCustomerPhone(String phone) {
    return orderRepository.findByCustomerPhone(phone);
}

public List<Order> getAllOrders() {
    return orderRepository.findAll();
}
}
