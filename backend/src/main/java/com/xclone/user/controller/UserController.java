package com.xclone.user.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.security.UserPrincipal;
import com.xclone.user.dto.UpdateProfileRequest;
import com.xclone.user.dto.UserProfileResponse;
import com.xclone.user.dto.UserSummaryDto;
import com.xclone.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserProfile(
            @PathVariable String username,
            @AuthenticationPrincipal UserPrincipal currentPrincipal) {
        UserProfileResponse profile = userService.getUserProfile(username, currentPrincipal);
        return ResponseEntity.ok(ApiResponse.success(profile, "User profile retrieved successfully"));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserSummaryDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentPrincipal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserSummaryDto updated = userService.updateProfile(currentPrincipal, request);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> searchUsers(
            @RequestParam(name = "q", defaultValue = "") String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDto> results = userService.searchUsers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "User search results"));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getFollowers(
            @PathVariable String username,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserSummaryDto> followers = userService.getUserFollowers(username, pageable);
        return ResponseEntity.ok(ApiResponse.success(followers, "User followers retrieved"));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> getFollowing(
            @PathVariable String username,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<UserSummaryDto> following = userService.getUserFollowing(username, pageable);
        return ResponseEntity.ok(ApiResponse.success(following, "User following retrieved"));
    }
}
