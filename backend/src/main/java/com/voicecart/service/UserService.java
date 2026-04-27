package com.voicecart.service;

import com.voicecart.model.User;
import com.voicecart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    public User createUser(User user) {
        user.setRole(User.Role.CUSTOMER);
        return userRepository.save(user);
    }
}
