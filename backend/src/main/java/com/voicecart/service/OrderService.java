package com.voicecart.service;

import com.voicecart.model.*;
import com.voicecart.repository.CallLogRepository;
import com.voicecart.repository.OrderItemRepository;
import com.voicecart.repository.OrderRepository;
import com.voicecart.repository.ProductRepository;
import com.voicecart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CallLogRepository callLogRepository;
    private final TwilioService twilioService;

    private final AtomicInteger sequence = new AtomicInteger(1);

    @Transactional
    public Order placeOrder(OrderRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        User agent = null;
        if (request.getAgentId() != null) {
            agent = userRepository.findById(request.getAgentId()).orElse(null);
        }

        CallLog call = null;
        if (request.getCallId() != null) {
            call = callLogRepository.findById(request.getCallId()).orElse(null);
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setAgent(agent);
        order.setCall(call);
        order.setDeliveryAddress(request.getDeliveryAddress() != null ? request.getDeliveryAddress() : customer.getAddress());
        order.setStatus(Order.OrderStatus.CONFIRMED);

        BigDecimal totalAmount = BigDecimal.ZERO;
        
        order = orderRepository.save(order);

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setProductName(product.getName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            orderItemRepository.save(orderItem);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Send SMS
        twilioService.sendOrderConfirmationSms(customer.getPhoneNumber(), order.getOrderNumber(), totalAmount);

        return order;
    }

    private String generateOrderNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return String.format("VC-%s-%s", datePart, randomPart);
    }
    
    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElse(null);
    }
}
