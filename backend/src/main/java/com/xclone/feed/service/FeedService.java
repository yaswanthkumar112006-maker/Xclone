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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FeedService {

    private final PostRepository postRepository;
    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    public FeedService(PostRepository postRepository,
                       FollowRepository followRepository,
                       UserRepository userRepository,
                       PostService postService) {
        this.postRepository = postRepository;
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.postService = postService;
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getHomeFeed(UserPrincipal principal, Pageable pageable) {
        User currentUser = userRepository.getReferenceById(principal.getId());

        List<Follow> follows = followRepository.findByFollower(currentUser);
        List<User> targetUsers = new ArrayList<>();
        targetUsers.add(currentUser);
        for (Follow follow : follows) {
            targetUsers.add(follow.getFollowing());
        }

        Page<Post> posts = postRepository.findByUserInAndParentPostIsNullOrderByCreatedAtDesc(targetUsers, pageable);
        return posts.map(post -> postService.mapToPostResponse(post, principal));
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getExploreFeed(UserPrincipal principal, Pageable pageable) {
        Page<Post> posts = postRepository.findByParentPostIsNullOrderByCreatedAtDesc(pageable);
        return posts.map(post -> postService.mapToPostResponse(post, principal));
    }
}
