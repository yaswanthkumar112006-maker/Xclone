package com.xclone.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePostRequest {

    @NotBlank(message = "Post content cannot be empty")
    @Size(min = 1, max = 280, message = "Post content cannot exceed 280 characters")
    private String content;

    private Long parentPostId;

    public CreatePostRequest() {
    }

    public CreatePostRequest(String content) {
        this.content = content;
    }

    public CreatePostRequest(String content, Long parentPostId) {
        this.content = content;
        this.parentPostId = parentPostId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getParentPostId() {
        return parentPostId;
    }

    public void setParentPostId(Long parentPostId) {
        this.parentPostId = parentPostId;
    }
}
