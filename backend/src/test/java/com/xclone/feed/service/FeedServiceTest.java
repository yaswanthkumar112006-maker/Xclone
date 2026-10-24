package com.xclone.feed.service;

import com.xclone.follow.entity.Follow;
import com.xclone.follow.repository.FollowRepository;
import com.xclone.post.dto.PostResponse;
import com.xclone.post.entity.Post;
import com.xclone.post.repository.PostRepository;
import com.xclone.post.service.PostService;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeedServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private FollowRepository followRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PostService postService;

    @InjectMocks
    private FeedService feedService;

    private User currentUser;
    private User followedUser;
    private UserPrincipal currentPrincipal;
    private Post samplePost;

    @BeforeEach
    void setUp() {
        currentUser = new User("alice", "alice@example.com", "pass", "Alice");
        currentUser.setId(1L);

        followedUser = new User("bob", "bob@example.com", "pass", "Bob");
        followedUser.setId(2L);

        currentPrincipal = new UserPrincipal(1L, "alice", "alice@example.com", "pass", Collections.emptyList());

        samplePost = new Post(followedUser, "A tweet from Bob");
        samplePost.setId(100L);
    }

    @Test
    @DisplayName("Should retrieve home feed containing followed users posts")
    void testGetHomeFeed() {
        Pageable pageable = PageRequest.of(0, 10);
        Follow follow = new Follow(currentUser, followedUser);

        when(userRepository.getReferenceById(1L)).thenReturn(currentUser);
        when(followRepository.findByFollower(currentUser)).thenReturn(List.of(follow));

        Page<Post> postPage = new PageImpl<>(List.of(samplePost));
        when(postRepository.findByUserInAndParentPostIsNullOrderByCreatedAtDesc(any(), eq(pageable)))
                .thenReturn(postPage);

        PostResponse mockResponse = new PostResponse();
        mockResponse.setId(100L);
        mockResponse.setContent("A tweet from Bob");
        when(postService.mapToPostResponse(samplePost, currentPrincipal)).thenReturn(mockResponse);

        Page<PostResponse> result = feedService.getHomeFeed(currentPrincipal, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("A tweet from Bob", result.getContent().get(0).getContent());
    }

    @Test
    @DisplayName("Should retrieve explore feed with top-level posts")
    void testGetExploreFeed() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Post> postPage = new PageImpl<>(List.of(samplePost));

        when(postRepository.findByParentPostIsNullOrderByCreatedAtDesc(pageable))
                .thenReturn(postPage);

        PostResponse mockResponse = new PostResponse();
        mockResponse.setId(100L);
        when(postService.mapToPostResponse(samplePost, currentPrincipal)).thenReturn(mockResponse);

        Page<PostResponse> result = feedService.getExploreFeed(currentPrincipal, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }
}
