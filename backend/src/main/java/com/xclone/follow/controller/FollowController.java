package com.xclone.follow.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.follow.service.FollowService;
import com.xclone.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/{username}/follow")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> followUser(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal principal) {
        followService.followUser(username, principal);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully followed @" + username));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> unfollowUser(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal principal) {
        followService.unfollowUser(username, principal);
        return ResponseEntity.ok(ApiResponse.success(null, "Successfully unfollowed @" + username));
    }
}
