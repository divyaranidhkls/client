"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type Props = {
  postId: string;
};

export default function PostLike({ postId }: Props) {
  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLikes = async () => {
    try {
      const res = await fetch(`http://localhost:3000/Like/getAllLikes/${postId}`, {
        credentials: "include",
      });
      const data = await res.json();
  
      console.log("Likes fetched:", data.total); // ✅ DEBUG LOG
  
      // Set the likes count and liked status based on the response
      setLikes(data.total || 0); // Assuming `total` is the number of likes
      setLikedByUser(data.userHasLiked || false); // Assuming `userHasLiked` indicates if the user has liked the post
    } catch (error) {
      console.error("Failed to fetch likes:", error);
    }
  };
  

  const toggleLike = async () => {
    setLoading(true);
    try {
      const endpoint = likedByUser
        ? `http://localhost:3000/Like/DeleteLikes/${postId}`
        : `http://localhost:3000/Like/LikePosts/${postId}`;
  
      const method = likedByUser ? "DELETE" : "POST";
  
      const res = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const contentType = res.headers.get("Content-Type");
  
      let errorMessage = "Something went wrong";
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const text = await res.text();
          errorMessage = text || errorMessage;
        }
        console.error("Backend returned error:", errorMessage);
        throw new Error(errorMessage);
      }
  
      const data = await res.json();
      console.log("Like toggle success:", data);
  
      // Optimistically update the UI
      setLikedByUser(!likedByUser);
      setLikes((prev) => prev + (likedByUser ? -1 : 1));
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchLikes();
  }, []);

  return (
   
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={toggleLike}
            disabled={loading}
            className={`text-sm flex items-center space-x-1 ${
              likedByUser ? "text-red-600" : "text-gray-500"
            }`}
          >
            <Heart className="w-5 h-5" fill={likedByUser ? "red" : "none"} />
            <span>{likes}</span> {/* Only show likes if > 0 */}
          </button>
        </div>
      );
      
}
