"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  post: {
    id: string;
    title: string;
  };
}

export default function AllCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null); // Reset error state on new request
    try {
      const res = await fetch(
        `http://localhost:3000/comment/all?page=${currentPage}&limit=4`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await res.json();
      const cleanedComments: Comment[] = (data.data ?? []).filter(
        (c: any): c is Comment => !!c?.id
      );

      setComments((prev) => {
        const newComments = cleanedComments.filter(
          (newComment) =>
            !prev.some((existing) => existing.id === newComment.id)
        );
        return [...prev, ...newComments];
      });

      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setError("An error occurred while fetching comments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments(page);
  }, [page, fetchComments]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">💬 All Comments</h1>

      {loading && comments.length === 0 ? (
        <div className="text-center text-gray-500">Loading comments...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-center">No comments available.</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => {
            if (!comment.id) return null;

            return (
              <li
                key={comment.id}
                className="bg-white border border-gray-200 shadow-sm rounded-lg p-5 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {comment.user?.name ?? "Anonymous"}
                  </h2>
                  <span className="text-sm text-gray-500">
                    📅 {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-700 mb-2">{comment.content}</p>

                <p className="text-sm text-gray-500">
                  on post:{comment.post?.title ? " " : ""}
                  <span className="italic text-blue-600">
                    {comment.user?.username ?? "Unknown Post"}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {page < totalPages && !loading && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            className="bg-orange-500 text-white font-medium px-5 py-2 rounded hover:bg-orange-600 transition disabled:opacity-50"
            disabled={loading}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
