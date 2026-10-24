package com.xclone.like.service;

import com.xclone.common.exception.BadRequestException;
import com.xclone.common.exception.ResourceNotFoundException;
import com.xclone.like.entity.Like;
import com.xclone.like.repository.LikeRepository;
import com.xclone.post.entity.Post;
import com.xclone.post.repository.PostRepository;
import com.xclone.security.UserPrincipal;
import com.xclone.user.entity.User;
import com.xclone.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository,
                       PostRepository postRepository,
                       UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void likePost(Long postId, UserPrincipal principal) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User user = userRepository.getReferenceById(principal.getId());

        if (likeRepository.existsByUserAndPost(user, post)) {
            throw new BadRequestException("You have already liked this post");
        }

        Like like = new Like(user, post);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId, UserPrincipal principal) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User user = userRepository.getReferenceById(principal.getId());

        likeRepository.deleteByUserAndPost(user, post);
    }

    @Transactional(readOnly = true)
    public boolean hasUserLikedPost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        User user = userRepository.getReferenceById(userId);
        return likeRepository.existsByUserAndPost(user, post);
    }
}
