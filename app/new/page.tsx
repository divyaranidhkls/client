"use client";

import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NewPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/posts/getAllposts?page=${pageNum}&limit=${limit}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", res.status, errorText);
        return;
      }

      const data = await res.json();
      setPosts((prev) => {
        
        const newPosts = data.data.filter((newPost: Post) => !prev.some((post: Post) => post.id === newPost.id));
        return [...prev, ...newPosts];
      });
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1); 
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">📰 New Posts</h1>

      {posts.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No posts found.</p>
      )}

      <ul className="space-y-6">
        {posts.map((post) => (
          <li
            key={post.id}  
            className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {post.title}
            </h2>
            <p className="text-gray-700 mb-2">{post.content}</p>
            <p className="text-sm text-gray-500">
              📅 {new Date(post.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

     
      {page < totalPages && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="bg-orange-500 text-white font-medium px-5 py-2 rounded hover:bg-orange-600 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
