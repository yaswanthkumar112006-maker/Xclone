package com.xclone.follow.service;

import com.xclone.common.exception.BadRequestException;
import com.xclone.follow.entity.Follow;
import com.xclone.follow.repository.FollowRepository;
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

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FollowServiceTest {

    @Mock
    private FollowRepository followRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FollowService followService;

    private User follower;
    private User following;
    private UserPrincipal followerPrincipal;

    @BeforeEach
    void setUp() {
        follower = new User("alice", "alice@example.com", "pass", "Alice");
        follower.setId(1L);

        following = new User("bob", "bob@example.com", "pass", "Bob");
        following.setId(2L);

        followerPrincipal = new UserPrincipal(1L, "alice", "alice@example.com", "pass", Collections.emptyList());
    }

    @Test
    @DisplayName("Should successfully follow user")
    void testFollowUserSuccess() {
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(following));
        when(userRepository.getReferenceById(1L)).thenReturn(follower);
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(false);

        followService.followUser("bob", followerPrincipal);

        verify(followRepository).save(any(Follow.class));
    }

    @Test
    @DisplayName("Should prevent self-following")
    void testFollowSelfFails() {
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(follower));

        assertThrows(BadRequestException.class, () -> followService.followUser("alice", followerPrincipal));
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    @DisplayName("Should prevent duplicate follow")
    void testDuplicateFollowFails() {
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(following));
        when(userRepository.getReferenceById(1L)).thenReturn(follower);
        when(followRepository.existsByFollowerAndFollowing(follower, following)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> followService.followUser("bob", followerPrincipal));
        verify(followRepository, never()).save(any(Follow.class));
    }

    @Test
    @DisplayName("Should unfollow user successfully")
    void testUnfollowUserSuccess() {
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(following));
        when(userRepository.getReferenceById(1L)).thenReturn(follower);

        followService.unfollowUser("bob", followerPrincipal);

        verify(followRepository).deleteByFollowerAndFollowing(follower, following);
    }
}
