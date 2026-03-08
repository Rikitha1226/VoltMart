package com.voltmart.service;

import com.voltmart.entity.Product;
import com.voltmart.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {


private final ProductRepository repository;

public ProductService(ProductRepository repository) {
    this.repository = repository;
}

public Product addProduct(Product product) {
    return repository.save(product);
}

public List<Product> getAllProducts() {
    return repository.findAll();
}

public Product getProductById(Long id) {
    return repository.findById(id).orElse(null);
}

public Product updateProduct(Long id, Product updatedProduct) {
    Product product = repository.findById(id).orElse(null);

    if (product != null) {
        product.setName(updatedProduct.getName());
        product.setCategory(updatedProduct.getCategory());
        product.setBrand(updatedProduct.getBrand());
        product.setPrice(updatedProduct.getPrice());
        product.setStock(updatedProduct.getStock());
        product.setRackLocation(updatedProduct.getRackLocation());
        product.setDescription(updatedProduct.getDescription());

        return repository.save(product);
    }

    return null;
}

public List<Product> getLowStockProducts() {
return repository.findByStockLessThan(5);
}

public List<Product> searchProducts(String name) {
return repository.findByNameContainingIgnoreCase(name);
}

public void deleteProduct(Long id) {
if(!repository.existsById(id)){
    throw new RuntimeException("Product not found");
}

repository.deleteById(id);


}

}
