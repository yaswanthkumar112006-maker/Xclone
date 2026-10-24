package com.xclone.post.service;

import com.xclone.common.exception.ResourceNotFoundException;
import com.xclone.like.entity.Like;
import com.xclone.like.repository.LikeRepository;
import com.xclone.post.dto.CreatePostRequest;
import com.xclone.post.dto.PostResponse;
import com.xclone.post.dto.UpdatePostRequest;
import com.xclone.post.entity.Post;
import com.xclone.post.repository.PostRepository;
import com.xclone.security.UserPrincipal;
import com.xclone.user.dto.UserSummaryDto;
import com.xclone.user.entity.User;
import com.xclone.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    public PostService(PostRepository postRepository,
                       UserRepository userRepository,
                       LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

    @Transactional
    public PostResponse createPost(UserPrincipal principal, CreatePostRequest request) {
        User author = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));

        Post parentPost = null;
        if (request.getParentPostId() != null) {
            parentPost = postRepository.findById(request.getParentPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent post not found with id: " + request.getParentPostId()));
        }

        Post post = new Post(author, request.getContent().trim(), parentPost);
        Post savedPost = postRepository.save(post);

        return mapToPostResponse(savedPost, principal);
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(Long id, UserPrincipal principal) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        return mapToPostResponse(post, principal);
    }

    @Transactional
    public PostResponse updatePost(Long id, UserPrincipal principal, UpdatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        if (!post.getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not have permission to edit this post");
        }

        post.setContent(request.getContent().trim());
        Post updatedPost = postRepository.save(post);

        return mapToPostResponse(updatedPost, principal);
    }

    @Transactional
    public void deletePost(Long id, UserPrincipal principal) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        if (!post.getUser().getId().equals(principal.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this post");
        }

        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getPostReplies(Long id, UserPrincipal principal, Pageable pageable) {
        Post parentPost = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));

        return postRepository.findByParentPostOrderByCreatedAtAsc(parentPost, pageable)
                .map(reply -> mapToPostResponse(reply, principal));
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getUserPosts(String username, UserPrincipal principal, Pageable pageable) {
        User user = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return postRepository.findByUserAndParentPostIsNullOrderByCreatedAtDesc(user, pageable)
                .map(post -> mapToPostResponse(post, principal));
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getUserLikedPosts(String username, UserPrincipal principal, Pageable pageable) {
        User user = userRepository.findByUsername(username.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return likeRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(Like::getPost)
                .map(post -> mapToPostResponse(post, principal));
    }

    public PostResponse mapToPostResponse(Post post, UserPrincipal principal) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setAuthor(UserSummaryDto.fromEntity(post.getUser()));
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        if (post.getParentPost() != null) {
            response.setParentPostId(post.getParentPost().getId());
            response.setParentPostAuthorUsername(post.getParentPost().getUser().getUsername());
        }

        response.setLikeCount(likeRepository.countByPost(post));
        response.setReplyCount(postRepository.countByParentPost(post));

        boolean liked = false;
        boolean isAuthor = false;

        if (principal != null) {
            User currentUser = userRepository.getReferenceById(principal.getId());
            liked = likeRepository.existsByUserAndPost(currentUser, post);
            isAuthor = post.getUser().getId().equals(principal.getId());
        }

        response.setLikedByCurrentUser(liked);
        response.setAuthor(isAuthor);

        return response;
    }
}
