package com.xclone.feed.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.feed.service.FeedService;
import com.xclone.post.dto.PostResponse;
import com.xclone.security.UserPrincipal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getHomeFeed(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostResponse> feed = feedService.getHomeFeed(principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(feed, "Home timeline feed retrieved successfully"));
    }

    @GetMapping("/explore")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> getExploreFeed(
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PostResponse> feed = feedService.getExploreFeed(principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(feed, "Explore feed retrieved successfully"));
    }
}
