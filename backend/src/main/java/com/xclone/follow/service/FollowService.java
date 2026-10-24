package com.xclone.follow.service;

import com.xclone.common.exception.BadRequestException;
import com.xclone.common.exception.ResourceNotFoundException;
import com.xclone.follow.entity.Follow;
import com.xclone.follow.repository.FollowRepository;
import com.xclone.security.UserPrincipal;
import com.xclone.user.entity.User;
import com.xclone.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public FollowService(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void followUser(String username, UserPrincipal principal) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        if (targetUser.getId().equals(principal.getId())) {
            throw new BadRequestException("You cannot follow yourself");
        }

        User currentUser = userRepository.getReferenceById(principal.getId());

        if (followRepository.existsByFollowerAndFollowing(currentUser, targetUser)) {
            throw new BadRequestException("You are already following @" + username);
        }

        Follow follow = new Follow(currentUser, targetUser);
        followRepository.save(follow);
    }

    @Transactional
    public void unfollowUser(String username, UserPrincipal principal) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        User currentUser = userRepository.getReferenceById(principal.getId());

        followRepository.deleteByFollowerAndFollowing(currentUser, targetUser);
    }
}
