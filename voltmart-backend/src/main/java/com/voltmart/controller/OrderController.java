package com.voltmart.controller;

import com.voltmart.entity.Order;
import com.voltmart.entity.OrderItem;
import com.voltmart.service.OrderService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ---------------- CREATE ORDER ----------------
    @PostMapping
    public Order createOrder(@RequestBody OrderRequest request) {

        // Convert OrderItemRequest → OrderItem
        List<OrderItem> orderItems = request.getItems()
                .stream()
                .map(item -> {
                    OrderItem oi = new OrderItem();
                    oi.setProductId(item.getProductId());
                    oi.setQuantity(item.getQuantity());
                    return oi;
                })
                .collect(Collectors.toList());

        return orderService.createOrder(
                request.getCustomerPhone(),
                orderItems
        );
    }

    // ---------------- GET ALL ORDERS ----------------
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ---------------- GET CUSTOMER ORDERS ----------------
    @GetMapping("/customer/{phone}")
    public List<Order> getCustomerOrders(@PathVariable String phone) {
        return orderService.getOrdersByCustomerPhone(phone);
    }


    // =====================================================
    // REQUEST CLASSES
    // =====================================================

    public static class OrderRequest {

        private String customerPhone;
        private List<OrderItemRequest> items;

        public String getCustomerPhone() {
            return customerPhone;
        }

        public void setCustomerPhone(String customerPhone) {
            this.customerPhone = customerPhone;
        }

        public List<OrderItemRequest> getItems() {
            return items;
        }

        public void setItems(List<OrderItemRequest> items) {
            this.items = items;
        }
    }


    public static class OrderItemRequest {

        private Long productId;
        private int quantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}