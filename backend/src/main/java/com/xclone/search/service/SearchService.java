package com.xclone.search.service;

import com.xclone.post.dto.PostResponse;
import com.xclone.post.repository.PostRepository;
import com.xclone.post.service.PostService;
import com.xclone.security.UserPrincipal;
import com.xclone.user.dto.UserSummaryDto;
import com.xclone.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SearchService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public SearchService(UserRepository userRepository,
                         PostRepository postRepository,
                         PostService postService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.postService = postService;
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDto> searchUsers(String query, Pageable pageable) {
        String cleanQuery = query != null ? query.trim() : "";
        return userRepository.findByUsernameContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(
                cleanQuery, cleanQuery, pageable
        ).map(UserSummaryDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> searchPosts(String query, UserPrincipal principal, Pageable pageable) {
        String cleanQuery = query != null ? query.trim() : "";
        return postRepository.findByContentContainingIgnoreCaseAndParentPostIsNullOrderByCreatedAtDesc(
                cleanQuery, pageable
        ).map(post -> postService.mapToPostResponse(post, principal));
    }
}
