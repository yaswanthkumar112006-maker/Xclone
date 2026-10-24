package com.xclone.user.service;

import com.xclone.common.exception.ResourceNotFoundException;
import com.xclone.follow.entity.Follow;
import com.xclone.follow.repository.FollowRepository;
import com.xclone.post.repository.PostRepository;
import com.xclone.security.UserPrincipal;
import com.xclone.user.dto.UpdateProfileRequest;
import com.xclone.user.dto.UserProfileResponse;
import com.xclone.user.dto.UserSummaryDto;
import com.xclone.user.entity.User;
import com.xclone.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;

    public UserService(UserRepository userRepository,
                       FollowRepository followRepository,
                       PostRepository postRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(String username, UserPrincipal currentPrincipal) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        long followersCount = followRepository.countByFollowing(targetUser);
        long followingCount = followRepository.countByFollower(targetUser);
        long postsCount = postRepository.findByUserAndParentPostIsNullOrderByCreatedAtDesc(targetUser, Pageable.unpaged()).getTotalElements();

        boolean followedByCurrentUser = false;
        boolean isCurrentUser = false;

        if (currentPrincipal != null) {
            isCurrentUser = currentPrincipal.getId().equals(targetUser.getId());
            if (!isCurrentUser) {
                User currentUser = userRepository.getReferenceById(currentPrincipal.getId());
                followedByCurrentUser = followRepository.existsByFollowerAndFollowing(currentUser, targetUser);
            }
        }

        return new UserProfileResponse(
                UserSummaryDto.fromEntity(targetUser),
                followersCount,
                followingCount,
                postsCount,
                followedByCurrentUser,
                isCurrentUser
        );
    }

    @Transactional
    public UserSummaryDto updateProfile(UserPrincipal currentPrincipal, UpdateProfileRequest request) {
        User user = userRepository.findById(currentPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (request.getDisplayName() != null && !request.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(request.getDisplayName().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation().trim());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getHeaderUrl() != null) {
            user.setHeaderUrl(request.getHeaderUrl().trim());
        }

        User updatedUser = userRepository.save(user);
        return UserSummaryDto.fromEntity(updatedUser);
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDto> searchUsers(String query, Pageable pageable) {
        String cleanQuery = query != null ? query.trim() : "";
        return userRepository.findByUsernameContainingIgnoreCaseOrDisplayNameContainingIgnoreCase(
                cleanQuery, cleanQuery, pageable
        ).map(UserSummaryDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getUserFollowers(String username, Pageable pageable) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return followRepository.findByFollowing(targetUser, pageable)
                .map(Follow::getFollower)
                .map(UserSummaryDto::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<UserSummaryDto> getUserFollowing(String username, Pageable pageable) {
        User targetUser = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return followRepository.findByFollower(targetUser, pageable)
                .map(Follow::getFollowing)
                .map(UserSummaryDto::fromEntity);
    }
}
