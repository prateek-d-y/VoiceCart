package com.voicecart.service;

import java.util.List;

public class OrderRequest {
    private Long customerId;
    private Long agentId;
    private Long callId;
    private String deliveryAddress;
    private List<OrderItemRequest> items;
    private Boolean isAsap;
    private String scheduledTime;
    private String couponCode;
    private Double taxAmount;
    private Double subtotal;
    private Double totalAmount;

    public OrderRequest() {}

    public Long getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getAgentId() {
        return this.agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public Long getCallId() {
        return this.callId;
    }

    public void setCallId(Long callId) {
        this.callId = callId;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderItemRequest> getItems() {
        return this.items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public Boolean getIsAsap() {
        return this.isAsap;
    }

    public void setIsAsap(Boolean isAsap) {
        this.isAsap = isAsap;
    }

    public String getScheduledTime() {
        return this.scheduledTime;
    }

    public void setScheduledTime(String scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public String getCouponCode() {
        return this.couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public Double getTaxAmount() {
        return this.taxAmount;
    }

    public void setTaxAmount(Double taxAmount) {
        this.taxAmount = taxAmount;
    }

    public Double getSubtotal() {
        return this.subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getTotalAmount() {
        return this.totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

}
