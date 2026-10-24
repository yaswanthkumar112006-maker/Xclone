package com.xclone.post.dto;

import com.xclone.user.dto.UserSummaryDto;
import java.time.Instant;

public class PostResponse {

    private Long id;
    private String content;
    private UserSummaryDto author;
    private Instant createdAt;
    private Instant updatedAt;
    private Long parentPostId;
    private String parentPostAuthorUsername;
    private long likeCount;
    private long replyCount;
    private boolean likedByCurrentUser;
    private boolean isAuthor;

    public PostResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public UserSummaryDto getAuthor() {
        return author;
    }

    public void setAuthor(UserSummaryDto author) {
        this.author = author;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(Long parentPostId) {
        this.parentPostId = parentPostId;
    }

    public String getParentPostAuthorUsername() {
        return parentPostAuthorUsername;
    }

    public void setParentPostAuthorUsername(String parentPostAuthorUsername) {
        this.parentPostAuthorUsername = parentPostAuthorUsername;
    }

    public long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(long likeCount) {
        this.likeCount = likeCount;
    }

    public long getReplyCount() {
        return replyCount;
    }

    public void setReplyCount(long replyCount) {
        this.replyCount = replyCount;
    }

    public boolean isLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public boolean isAuthor() {
        return isAuthor;
    }

    public void setAuthor(boolean author) {
        isAuthor = author;
    }
}
