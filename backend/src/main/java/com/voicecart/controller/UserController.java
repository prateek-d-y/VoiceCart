package com.voicecart.controller;

import com.voicecart.model.User;
import com.voicecart.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private UserService userService;
    private com.voicecart.repository.OrderRepository orderRepository;
    private com.voicecart.repository.CallLogRepository callLogRepository;

    @GetMapping("/lookup")
    public ResponseEntity<?> lookupUser(@RequestParam String phone) {
        return userService.findByPhoneNumber(phone)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}/address")
    public ResponseEntity<User> updateAddress(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        User user = userService.findById(id);
        if (user == null) return ResponseEntity.notFound().build();
        user.setAddress(body.get("address"));
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<?> getUserOrders(@PathVariable Long id) {
        // Return top 5 recent orders
        java.util.List<com.voicecart.model.Order> orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(id);
        if (orders.size() > 5) {
            orders = orders.subList(0, 5);
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{phone}/calls")
    public ResponseEntity<?> getUserCalls(@PathVariable String phone) {
        // Return top 5 recent calls
        java.util.List<com.voicecart.model.CallLog> calls = callLogRepository.findByCustomerPhoneOrderByStartedAtDesc(phone);
        if (calls.size() > 5) {
            calls = calls.subList(0, 5);
        }
        return ResponseEntity.ok(calls);
    }

    public UserController(UserService userService) {
        this.userService = userService;
    }

    public UserService getUserService() {
        return this.userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

}
