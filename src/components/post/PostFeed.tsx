import React, { useRef, useEffect, useCallback } from "react";
import { CreatePostV2, PostList } from "./";
import { usePostFeed } from "../../hooks";
import { Loader } from "../common";

const PostFeed: React.FC = () => {
  const { posts, loading, loadingMore, error, fetchPosts, loadMore, hasMore } =
    usePostFeed();

  // Reference for the observer target element
  const observerTarget = useRef<HTMLDivElement>(null);

  // Intersection observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Only load more if the target is at least 50% visible and we have more posts to load
      if (entry.isIntersecting && hasMore && !loadingMore) {
        loadMore();
      }
    },
    [loadMore, hasMore, loadingMore]
  );

  // Set up the intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // viewport as root
      // Add negative margin to ensure the observer triggers closer to the bottom
      rootMargin: "0px 0px 100px 0px", // Only load when within 100px of the bottom
      threshold: 0.5, // Trigger when 50% of the target is visible
    });

    if (observerTarget.current && !loading) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleObserver, loading]);

  return (
    <div>
      <CreatePostV2 fetchPosts={() => fetchPosts(true)} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <>
          <PostList
            posts={posts}
            fetchPosts={() => fetchPosts(true)}
            fromHomePage={true}
          />

          {/* Loading indicator for more posts */}
          {loadingMore && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading more posts...</p>
            </div>
          )}

          {/* Observer target element */}
          {!loading && hasMore && (
            <div ref={observerTarget} className="h-10 w-full"></div>
          )}

          {/* No more posts message */}
          {!loading && !loadingMore && !hasMore && posts.length > 0 && (
            <div className="text-center py-4 text-gray-500">
              No more posts to load
            </div>
          )}

          {/* No posts message */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No posts available
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostFeed;
