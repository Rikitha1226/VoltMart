package com.voltmart.entity;

import javax.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;

private Long orderId;

private Long productId;

private int quantity;

private double price;

public OrderItem() {}

public Long getId() {
    return id;
}

public Long getOrderId() {
    return orderId;
}

public Long getProductId() {
    return productId;
}

public int getQuantity() {
    return quantity;
}

public double getPrice() {
    return price;
}

public void setId(Long id) {
    this.id = id;
}

public void setOrderId(Long orderId) {
    this.orderId = orderId;
}

public void setProductId(Long productId) {
    this.productId = productId;
}

public void setQuantity(int quantity) {
    this.quantity = quantity;
}

public void setPrice(double price) {
    this.price = price;
}

}
