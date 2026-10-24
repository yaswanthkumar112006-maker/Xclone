package com.xclone.user.dto;

public class UserProfileResponse {

    private UserSummaryDto user;
    private long followersCount;
    private long followingCount;
    private long postsCount;
    private boolean followedByCurrentUser;
    private boolean isCurrentUser;

    public UserProfileResponse() {
    }

    public UserProfileResponse(UserSummaryDto user, long followersCount, long followingCount,
                               long postsCount, boolean followedByCurrentUser, boolean isCurrentUser) {
        this.user = user;
        this.followersCount = followersCount;
        this.followingCount = followingCount;
        this.postsCount = postsCount;
        this.followedByCurrentUser = followedByCurrentUser;
        this.isCurrentUser = isCurrentUser;
    }

    public UserSummaryDto getUser() {
        return user;
    }

    public void setUser(UserSummaryDto user) {
        this.user = user;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }

    public long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(long followingCount) {
        this.followingCount = followingCount;
    }

    public long getPostsCount() {
        return postsCount;
    }

    public void setPostsCount(long postsCount) {
        this.postsCount = postsCount;
    }

    public boolean isFollowedByCurrentUser() {
        return followedByCurrentUser;
    }

    public void setFollowedByCurrentUser(boolean followedByCurrentUser) {
        this.followedByCurrentUser = followedByCurrentUser;
    }

    public boolean isCurrentUser() {
        return isCurrentUser;
    }

    public void setCurrentUser(boolean currentUser) {
        isCurrentUser = currentUser;
    }
}
