"use client";
import { useEffect, useState } from "react";
import PostLike from "./like";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  username: string;
};

type LikeInfo = {
  count: number;
  likedByUser: boolean;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
};

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<{ [key: string]: LikeInfo }>({});
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [visibleComments, setVisibleComments] = useState<{ [key: string]: boolean }>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const limit = 5;

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:3000/posts/getAllposts?page=${pageNum}&limit=${limit}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      if (!res.ok) {
        setError("Failed to load posts.");
        return;
      }

      const json = JSON.parse(text);
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = json.data.filter((p: Post) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });

      for (const post of json.data) {
        fetchLikes(post.id);
      }

      if (pageNum >= json.pagination.totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/Like/getAllLikes/${postId}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
  
      const data = await res.json();
  
      if (res.ok && data.pagination && typeof data.pagination.total === "number") {
        setLikes((prev) => ({
          ...prev,
          [postId]: {
            count: data.pagination.total,
            likedByUser: data.userHasLiked ?? false,
          },
        }));
      } else {
        // fallback in case backend response is incomplete
        setLikes((prev) => ({
          ...prev,
          [postId]: {
            count: 0,
            likedByUser: false,
          },
        }));
      }
    } catch (err) {
      console.error(`Failed to fetch likes for ${postId}`, err);
      setLikes((prev) => ({
        ...prev,
        [postId]: {
          count: 0,
          likedByUser: false,
        },
      }));
    }
  };
  
 

  const fetchComments = async (postId: string) => {
    if (comments[postId]) return;

    try {
      const res = await fetch(`http://localhost:3000/comment/getAllComments/${postId}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await res.json();
      if (res.ok && data.data && Array.isArray(data.data)) {
        setComments((prev) => ({
          ...prev,
          [postId]: data.data,
        }));
      }
    } catch (err) {
      alert("Error fetching comments.");
    }
  };

  const toggleComments = async (postId: string) => {
    if (!comments[postId]) {
      await fetchComments(postId);
    }

    setVisibleComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = async (postId: string) => {
    const content = prompt("Enter your comment:");
    if (!content || content.trim() === "") {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/comment/on/${postId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Comment posted successfully!");
        await fetchComments(postId);
        setVisibleComments((prev) => ({ ...prev, [postId]: true }));
      } else {
        alert(data.message || "Failed to post comment.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <main className="p-4 max-w-2xl mx-auto">
      {posts.length === 0 && !loading && !error && <p>No posts available.</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul>
  {posts.map((post, index) => (
    <li key={post.id} className="mb-6 border-b pb-4">
      <strong>{index + 1}. </strong>
      <a href={`/${post.id}`} className="text-blue-600 hover:underline font-medium">
        {post.title}
      </a>
      <div className="text-sm text-gray-500 mt-1">
        Posted on {new Date(post.createdAt).toLocaleString()} by{" "}
        <span className="font-semibold">{post.username || "Unknown"}</span>
      </div>

      <div className="mt-2 flex gap-4 items-center">
        <PostLike postId={post.id} />
        <span className="text-sm text-gray-600">
          {likes[post.id]?.count ?? 0} {likes[post.id]?.count === 1 ? "like" : "likes"}
        </span>
      </div>

      <div className="mt-2">
        <button
          onClick={() => toggleComments(post.id)}
          className="text-sm text-blue-600 hover:underline"
        >
          {visibleComments[post.id] ? "Hide Comments" : "View Comments"}
        </button>

        {visibleComments[post.id] && (
          <>
            {comments[post.id] && comments[post.id].length > 0 ? (
              <ul className="mt-2 ml-4">
                {comments[post.id].map((comment) => (
                  <li key={comment.id} className="mb-2">
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500">
                      Commented on {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No comments yet.</p>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => handleComment(post.id)}
        className="mt-2 text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
      >
        Comment
      </button>
    </li>
  ))}
</ul>

      {loading && <p className="text-gray-500 mt-4">Loading...</p>}

      {hasMore && !loading && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
        >
          More
        </button>
      )}
    </main>
  );
}
