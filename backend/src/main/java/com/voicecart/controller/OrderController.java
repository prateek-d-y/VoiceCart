package com.voicecart.controller;

import com.voicecart.model.Order;
import com.voicecart.service.OrderRequest;
import com.voicecart.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.placeOrder(orderRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        Order order = orderService.getOrder(id);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.notFound().build();
    }
}
