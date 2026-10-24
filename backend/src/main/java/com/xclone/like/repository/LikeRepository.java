package com.xclone.like.repository;

import com.xclone.like.entity.Like;
import com.xclone.post.entity.Post;
import com.xclone.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {

    Optional<Like> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);

    long countByPost(Post post);

    void deleteByUserAndPost(User user, Post post);

    Page<Like> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
}
