package com.xclone.follow.repository;

import com.xclone.follow.entity.Follow;
import com.xclone.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowing(User follower, User following);

    boolean existsByFollowerAndFollowing(User follower, User following);

    long countByFollowing(User following); // Followers count

    long countByFollower(User follower);   // Following count

    void deleteByFollowerAndFollowing(User follower, User following);

    List<Follow> findByFollower(User follower);

    Page<Follow> findByFollowing(User following, Pageable pageable);

    Page<Follow> findByFollower(User follower, Pageable pageable);
}
