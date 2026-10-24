package com.xclone.post.service;

import com.xclone.like.repository.LikeRepository;
import com.xclone.post.dto.CreatePostRequest;
import com.xclone.post.dto.PostResponse;
import com.xclone.post.dto.UpdatePostRequest;
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
import org.springframework.security.access.AccessDeniedException;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private LikeRepository likeRepository;

    @InjectMocks
    private PostService postService;

    private User author;
    private User otherUser;
    private UserPrincipal authorPrincipal;
    private UserPrincipal otherPrincipal;
    private Post samplePost;

    @BeforeEach
    void setUp() {
        author = new User("alice", "alice@example.com", "pass", "Alice");
        author.setId(10L);

        otherUser = new User("bob", "bob@example.com", "pass", "Bob");
        otherUser.setId(20L);

        authorPrincipal = new UserPrincipal(10L, "alice", "alice@example.com", "pass", Collections.emptyList());
        otherPrincipal = new UserPrincipal(20L, "bob", "bob@example.com", "pass", Collections.emptyList());

        samplePost = new Post(author, "Hello, world!");
        samplePost.setId(100L);
    }

    @Test
    @DisplayName("Should create post when authenticated")
    void testCreatePost() {
        CreatePostRequest request = new CreatePostRequest("Hello, world!");

        when(userRepository.findById(10L)).thenReturn(Optional.of(author));
        when(postRepository.save(any(Post.class))).thenReturn(samplePost);
        when(userRepository.getReferenceById(10L)).thenReturn(author);
        when(likeRepository.countByPost(samplePost)).thenReturn(0L);
        when(postRepository.countByParentPost(samplePost)).thenReturn(0L);

        PostResponse response = postService.createPost(authorPrincipal, request);

        assertNotNull(response);
        assertEquals("Hello, world!", response.getContent());
        assertEquals("alice", response.getAuthor().getUsername());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    @DisplayName("Should allow owner to update post")
    void testUpdatePostSuccess() {
        UpdatePostRequest request = new UpdatePostRequest("Updated content");

        when(postRepository.findById(100L)).thenReturn(Optional.of(samplePost));
        when(postRepository.save(any(Post.class))).thenReturn(samplePost);
        when(userRepository.getReferenceById(10L)).thenReturn(author);

        PostResponse response = postService.updatePost(100L, authorPrincipal, request);

        assertNotNull(response);
        assertEquals("Updated content", samplePost.getContent());
    }

    @Test
    @DisplayName("Should forbid non-owner from updating post")
    void testUpdatePostAccessDenied() {
        UpdatePostRequest request = new UpdatePostRequest("Hacked content");

        when(postRepository.findById(100L)).thenReturn(Optional.of(samplePost));

        assertThrows(AccessDeniedException.class, () -> postService.updatePost(100L, otherPrincipal, request));
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    @DisplayName("Should allow owner to delete post")
    void testDeletePostSuccess() {
        when(postRepository.findById(100L)).thenReturn(Optional.of(samplePost));

        postService.deletePost(100L, authorPrincipal);

        verify(postRepository).delete(samplePost);
    }

    @Test
    @DisplayName("Should forbid non-owner from deleting post")
    void testDeletePostAccessDenied() {
        when(postRepository.findById(100L)).thenReturn(Optional.of(samplePost));

        assertThrows(AccessDeniedException.class, () -> postService.deletePost(100L, otherPrincipal));
        verify(postRepository, never()).delete(any(Post.class));
    }
}
