package com.voicecart.service;

import com.voicecart.model.*;
import com.voicecart.repository.CallLogRepository;
import com.voicecart.repository.OrderItemRepository;
import com.voicecart.repository.OrderRepository;
import com.voicecart.repository.ProductRepository;
import com.voicecart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderService {

    private OrderRepository orderRepository;
    private OrderItemRepository orderItemRepository;
    private ProductRepository productRepository;
    private UserRepository userRepository;
    private CallLogRepository callLogRepository;
    private TwilioService twilioService;

    private AtomicInteger sequence = new AtomicInteger(1);

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

        if (request.getIsAsap() != null) {
            order.setIsAsap(request.getIsAsap());
        }
        if (request.getScheduledTime() != null && !request.getScheduledTime().isEmpty()) {
            order.setScheduledTime(LocalDateTime.parse(request.getScheduledTime(), DateTimeFormatter.ISO_DATE_TIME));
        }
        if (request.getCouponCode() != null) {
            order.setCouponCode(request.getCouponCode());
        }
        if (request.getSubtotal() != null) {
            order.setSubtotal(BigDecimal.valueOf(request.getSubtotal()));
        }
        if (request.getTaxAmount() != null) {
            order.setTaxAmount(BigDecimal.valueOf(request.getTaxAmount()));
        }
        if (request.getTotalAmount() != null) {
            order.setTotalAmount(BigDecimal.valueOf(request.getTotalAmount()));
        } else {
            order.setTotalAmount(BigDecimal.ZERO); // Will be calculated below if not provided
        }

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
            orderItem.setCustomization(itemRequest.getCustomization());

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);

            orderItemRepository.save(orderItem);
        }

        // If totalAmount was not provided in request, use calculated
        if (request.getTotalAmount() == null) {
            // Apply tax to calculated subtotal if we must
            BigDecimal tax = order.getTaxAmount();
            order.setSubtotal(totalAmount);
            order.setTotalAmount(totalAmount.add(tax));
        }
        
        order = orderRepository.save(order);

        // Send SMS
        twilioService.sendOrderConfirmationSms(customer.getPhoneNumber(), order.getOrderNumber(), order.getTotalAmount());

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

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository, ProductRepository productRepository, UserRepository userRepository, CallLogRepository callLogRepository, TwilioService twilioService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.callLogRepository = callLogRepository;
        this.twilioService = twilioService;
    }

    public OrderRepository getOrderRepository() {
        return this.orderRepository;
    }

    public void setOrderRepository(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderItemRepository getOrderItemRepository() {
        return this.orderItemRepository;
    }

    public void setOrderItemRepository(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public ProductRepository getProductRepository() {
        return this.productRepository;
    }

    public void setProductRepository(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public UserRepository getUserRepository() {
        return this.userRepository;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public CallLogRepository getCallLogRepository() {
        return this.callLogRepository;
    }

    public void setCallLogRepository(CallLogRepository callLogRepository) {
        this.callLogRepository = callLogRepository;
    }

    public TwilioService getTwilioService() {
        return this.twilioService;
    }

    public void setTwilioService(TwilioService twilioService) {
        this.twilioService = twilioService;
    }


    public AtomicInteger getSequence() {
        return this.sequence;
    }

    public void setSequence(AtomicInteger sequence) {
        this.sequence = sequence;
    }

}
