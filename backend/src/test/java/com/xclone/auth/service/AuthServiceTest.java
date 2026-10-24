package com.xclone.auth.service;

import com.xclone.auth.dto.AuthResponse;
import com.xclone.auth.dto.LoginRequest;
import com.xclone.auth.dto.RegisterRequest;
import com.xclone.common.exception.BadRequestException;
import com.xclone.security.JwtTokenProvider;
import com.xclone.security.UserPrincipal;
import com.xclone.user.entity.User;
import com.xclone.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User("johndoe", "john@example.com", "encodedPassword", "John Doe");
        sampleUser.setId(1L);
    }

    @Test
    @DisplayName("Should successfully register new user")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("johndoe", "john@example.com", "password123", "John Doe");

        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromUserId(1L, "johndoe")).thenReturn("mockJwtToken");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("johndoe", response.getUser().getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration if username is duplicate")
    void testRegisterDuplicateUsername() {
        RegisterRequest request = new RegisterRequest("johndoe", "john@example.com", "password123", "John Doe");

        when(userRepository.existsByUsername("johndoe")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration if email is duplicate")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest("johndoe", "john@example.com", "password123", "John Doe");

        when(userRepository.existsByUsername("johndoe")).thenReturn(false);
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login user with valid credentials")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("johndoe", "password123");

        UserPrincipal principal = new UserPrincipal(1L, "johndoe", "john@example.com", "encodedPassword", Collections.emptyList());
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mockJwtToken");
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mockJwtToken", response.getToken());
        assertEquals("johndoe", response.getUser().getUsername());
    }

    @Test
    @DisplayName("Should propagate BadCredentialsException on invalid password")
    void testLoginInvalidCredentials() {
        LoginRequest request = new LoginRequest("johndoe", "wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }
}
