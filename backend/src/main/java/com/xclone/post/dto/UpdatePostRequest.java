package com.xclone.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdatePostRequest {

    @NotBlank(message = "Post content cannot be empty")
    @Size(min = 1, max = 280, message = "Post content cannot exceed 280 characters")
    private String content;

    public UpdatePostRequest() {
    }

    public UpdatePostRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
