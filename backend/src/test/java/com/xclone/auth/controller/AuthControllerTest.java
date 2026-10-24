package com.xclone.auth.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xclone.auth.dto.AuthResponse;
import com.xclone.auth.dto.LoginRequest;
import com.xclone.auth.dto.RegisterRequest;
import com.xclone.auth.service.AuthService;
import com.xclone.common.exception.GlobalExceptionHandler;
import com.xclone.security.CustomUserDetailsService;
import com.xclone.security.JwtTokenProvider;
import com.xclone.user.dto.UserSummaryDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandler.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @MockitoBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    @DisplayName("POST /api/v1/auth/register should return 201 on valid payload")
    void testRegisterValidPayload() throws Exception {
        RegisterRequest request = new RegisterRequest("johndoe", "john@example.com", "password123", "John Doe");

        UserSummaryDto userSummary = new UserSummaryDto();
        userSummary.setId(1L);
        userSummary.setUsername("johndoe");
        userSummary.setEmail("john@example.com");
        userSummary.setDisplayName("John Doe");

        AuthResponse authResponse = new AuthResponse("mockToken", userSummary);

        when(authService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mockToken"))
                .andExpect(jsonPath("$.data.user.username").value("johndoe"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register should return 400 on validation failure")
    void testRegisterInvalidPayload() throws Exception {
        RegisterRequest invalidRequest = new RegisterRequest("", "invalid-email", "123", "");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors").isArray());
    }

    @Test
    @DisplayName("POST /api/v1/auth/login should return 200 on valid credentials")
    void testLoginValid() throws Exception {
        LoginRequest request = new LoginRequest("johndoe", "password123");

        UserSummaryDto userSummary = new UserSummaryDto();
        userSummary.setId(1L);
        userSummary.setUsername("johndoe");
        userSummary.setDisplayName("John Doe");

        AuthResponse authResponse = new AuthResponse("mockToken", userSummary);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mockToken"));
    }
}
