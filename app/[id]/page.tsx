'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
};

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [likesCount, setLikesCount] = useState(0);
const [liked, setLiked] = useState(false);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:3000/posts/getpost/${id}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch post");

      const json = await res.json();
      setPost(json.data);
    } catch (err) {
      setError("Could not load the post");
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:3000/comments/on/${id}`, {
        credentials: "include",
      });

      const json = await res.json();
      setComments(json.data || []);
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };
  const fetchLikes = async () => {
    try {
      const res = await fetch(`http://localhost:3000/likes/on/${id}`, {
        credentials: "include",
      });
      const json = await res.json();
      setLikesCount(json.total || 0);
      setLiked(json.alreadyLiked);
    } catch (err) {
      console.error("Failed to fetch likes");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/comment/on/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
        credentials: "include",
      });

      if (res.ok) {
        const json = await res.json();
        setComments((prev) => [...prev, json.data]);
        setNewComment("");
      } else {
        const err = await res.json();
        console.error("Failed to add comment:", res.status, err);
        alert(err.message || "Failed to add comment");
      }
    } catch (err) {
      alert("Error adding comment");
    } finally {
      setLoading(false);
    }
  };
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/likes/on/${id}`, {
        method: "POST",
        credentials: "include",
      });
  
      if (res.ok) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        const err = await res.json();
        console.error("Like failed:", res.status, err);
        alert(err.message || "Failed to like post");
      }
    } catch (err) {
      alert("Error liking post");
    }
  };
  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
      fetchLikes();
    }
  }, [id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-700">{post.content}</p>
      <p className="text-sm text-gray-500 mt-2">
        Posted on {new Date(post.createdAt).toLocaleString()}
      </p>

      <p className="mt-2 text-sm text-gray-700">👍 {likesCount} {likesCount === 1 ? "like" : "likes"}</p>

{!liked && (
  <button
    onClick={handleLike}
    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
  >
    Like
  </button>
)}


      <form onSubmit={handleAddComment} className="mt-6 space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add Comment"}
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-2 rounded">
                <p>{comment.content}</p>
                <p className="text-xs text-gray-500">
                  Posted on {new Date(comment.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
