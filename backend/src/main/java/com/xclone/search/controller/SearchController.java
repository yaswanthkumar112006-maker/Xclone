package com.xclone.search.controller;

import com.xclone.common.dto.ApiResponse;
import com.xclone.post.dto.PostResponse;
import com.xclone.search.service.SearchService;
import com.xclone.security.UserPrincipal;
import com.xclone.user.dto.UserSummaryDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserSummaryDto>>> searchUsers(
            @RequestParam(name = "q", defaultValue = "") String query,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<UserSummaryDto> results = searchService.searchUsers(query, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "User search results"));
    }

    @GetMapping("/posts")
    public ResponseEntity<ApiResponse<Page<PostResponse>>> searchPosts(
            @RequestParam(name = "q", defaultValue = "") String query,
            @AuthenticationPrincipal UserPrincipal principal,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<PostResponse> results = searchService.searchPosts(query, principal, pageable);
        return ResponseEntity.ok(ApiResponse.success(results, "Post search results"));
    }
}
