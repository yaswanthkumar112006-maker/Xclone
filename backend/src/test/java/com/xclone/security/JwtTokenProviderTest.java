package com.xclone.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    @DisplayName("Should generate valid JWT token for authenticated principal")
    void testGenerateToken() {
        UserPrincipal principal = new UserPrincipal(1L, "johndoe", "john@example.com", "encodedPass", Collections.emptyList());
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        String token = jwtTokenProvider.generateToken(auth);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(1L, jwtTokenProvider.getUserIdFromToken(token));
        assertEquals("johndoe", jwtTokenProvider.getUsernameFromToken(token));
    }

    @Test
    @DisplayName("Should reject malformed or tampered token")
    void testValidateInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.jwt.token"));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    @DisplayName("Should reject expired token")
    void testValidateExpiredToken() throws InterruptedException {
        // Token provider with 1ms expiration
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(secret, 1);
        String token = shortLivedProvider.generateTokenFromUserId(2L, "expiredUser");

        Thread.sleep(10);
        assertFalse(shortLivedProvider.validateToken(token));
    }
}
