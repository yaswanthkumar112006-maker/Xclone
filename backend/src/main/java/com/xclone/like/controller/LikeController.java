package com.xclone.like.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.like.service.LikeService;
import com.xclone.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts/{postId}/like")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> likePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal principal) {
        likeService.likePost(postId, principal);
        return ResponseEntity.ok(ApiResponse.success(null, "Post liked successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> unlikePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserPrincipal principal) {
        likeService.unlikePost(postId, principal);
        return ResponseEntity.ok(ApiResponse.success(null, "Post unliked successfully"));
    }
}
