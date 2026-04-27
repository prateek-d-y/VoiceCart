package com.voicecart.service;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long customerId;
    private Long agentId;
    private Long callId;
    private String deliveryAddress;
    private List<OrderItemRequest> items;
}
