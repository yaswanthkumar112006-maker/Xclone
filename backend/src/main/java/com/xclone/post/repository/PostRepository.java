package com.xclone.post.repository;

import com.xclone.post.entity.Post;
import com.xclone.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Top-level posts for explore feed
    Page<Post> findByParentPostIsNullOrderByCreatedAtDesc(Pageable pageable);

    // Timeline feed: top-level posts from followed users + current user
    Page<Post> findByUserInAndParentPostIsNullOrderByCreatedAtDesc(Collection<User> users, Pageable pageable);

    // Profile posts by specific user
    Page<Post> findByUserAndParentPostIsNullOrderByCreatedAtDesc(User user, Pageable pageable);

    // Profile replies by specific user
    Page<Post> findByUserAndParentPostIsNotNullOrderByCreatedAtDesc(User user, Pageable pageable);

    // Thread replies to a specific post
    Page<Post> findByParentPostOrderByCreatedAtAsc(Post parentPost, Pageable pageable);

    // Count replies to a post
    long countByParentPost(Post parentPost);

    // Search posts by text content
    Page<Post> findByContentContainingIgnoreCaseAndParentPostIsNullOrderByCreatedAtDesc(String keyword, Pageable pageable);
}
