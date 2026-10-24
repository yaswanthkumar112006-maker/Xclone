package com.xclone.post.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.post.dto.CreatePostRequest;
import com.xclone.post.dto.PostResponse;
import com.xclone.post.dto.UpdatePostRequest;
import com.xclone.post.service.PostService;
import com.xclone.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreatePostRequest request) {
        PostResponse post = postService.createPost(principal, request);
        return new ResponseEntity<>(ApiResponse.success(post, "Post created successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> getPostById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        PostResponse post = postService.getPostById(id, principal);
        return ResponseEntity.ok(ApiResponse.success(post, "Post retrieved successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdatePostRequest request) {
        PostResponse updatedPost = postService.updatePost(id, principal, request);
        return ResponseEntity.ok(ApiResponse.success(updatedPost, "Post updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        postService.deletePost(id, principal);
        return ResponseEntity.ok(ApiResponse.success(null, "Post deleted successfully"));
    }

    @GetMapping("/{id}/replies")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getPostReplies(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        Page<PostResponse> replies = postService.getPostReplies(id, principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(replies, "Post replies retrieved successfully"));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getUserPosts(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostResponse> posts = postService.getUserPosts(username, principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(posts, "User posts retrieved successfully"));
    }

    @GetMapping("/user/{username}/likes")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getUserLikedPosts(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostResponse> likedPosts = postService.getUserLikedPosts(username, principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(likedPosts, "User liked posts retrieved successfully"));
    }
}
