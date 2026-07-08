package com.onnbikes.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Base64;
import java.util.Collections;

/**
 * Validates Supabase JWT tokens and sets Spring Security authentication context.
 * Supabase uses JWTs signed with the JWT secret (HS256).
 */
@Component
public class SupabaseJwtFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(SupabaseJwtFilter.class);

    private final SecretKey secretKey;

    public SupabaseJwtFilter(@Value("${app.supabase.jwt-secret}") String jwtSecret) {
        byte[] keyBytes = Base64.getDecoder().decode(
                Base64.getEncoder().encodeToString(jwtSecret.getBytes()));
        this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                String userId = claims.getSubject();
                String email = claims.get("email", String.class);

                if (userId != null) {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userId, null, Collections.emptyList());
                    auth.setDetails(email);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                log.warn("Invalid JWT token: {}", e.getMessage());
                // Don't set authentication — request will be rejected by SecurityConfig
            }
        }

        filterChain.doFilter(request, response);
    }
}
