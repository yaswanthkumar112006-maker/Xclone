package com.xclone.like.service;

import com.xclone.common.exception.BadRequestException;
import com.xclone.like.entity.Like;
import com.xclone.like.repository.LikeRepository;
import com.xclone.post.entity.Post;
import com.xclone.post.repository.PostRepository;
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
class LikeServiceTest {

    @Mock
    private LikeRepository likeRepository;

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LikeService likeService;

    private User user;
    private Post post;
    private UserPrincipal principal;

    @BeforeEach
    void setUp() {
        user = new User("alice", "alice@example.com", "pass", "Alice");
        user.setId(10L);

        post = new Post(user, "Test post content");
        post.setId(100L);

        principal = new UserPrincipal(10L, "alice", "alice@example.com", "pass", Collections.emptyList());
    }

    @Test
    @DisplayName("Should successfully like post")
    void testLikePostSuccess() {
        when(postRepository.findById(100L)).thenReturn(Optional.of(post));
        when(userRepository.getReferenceById(10L)).thenReturn(user);
        when(likeRepository.existsByUserAndPost(user, post)).thenReturn(false);

        likeService.likePost(100L, principal);

        verify(likeRepository).save(any(Like.class));
    }

    @Test
    @DisplayName("Should prevent duplicate like on same post")
    void testDuplicateLikeFails() {
        when(postRepository.findById(100L)).thenReturn(Optional.of(post));
        when(userRepository.getReferenceById(10L)).thenReturn(user);
        when(likeRepository.existsByUserAndPost(user, post)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> likeService.likePost(100L, principal));
        verify(likeRepository, never()).save(any(Like.class));
    }

    @Test
    @DisplayName("Should unlike post successfully")
    void testUnlikePostSuccess() {
        when(postRepository.findById(100L)).thenReturn(Optional.of(post));
        when(userRepository.getReferenceById(10L)).thenReturn(user);

        likeService.unlikePost(100L, principal);

        verify(likeRepository).deleteByUserAndPost(user, post);
    }
}
