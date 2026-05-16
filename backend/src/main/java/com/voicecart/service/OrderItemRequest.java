package com.voicecart.service;


public class OrderItemRequest {
    private Long productId;
    private Integer quantity;
    private String customization;

    public OrderItemRequest() {}

    public Long getProductId() {
        return this.productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCustomization() {
        return this.customization;
    }

    public void setCustomization(String customization) {
        this.customization = customization;
    }

}
