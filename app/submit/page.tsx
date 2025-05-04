"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Title and text are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"}/posts/createposts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // for session/cookie auth
          body: JSON.stringify({ title, content }),
        }
      );

      if (res.ok) {
        router.push("/");
      } else {
        const data = await res.json();
        alert(data.message || "Something went wrong.");
      }
    } catch (error: any) {
      console.error("Submit failed:", error);
      alert("An unexpected error occurred: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6 text-sm">
      <div className="bg-orange-500 p-2 text-black font-bold text-center">Submit</div>
      <form onSubmit={handleSubmit} className="bg-[#f6f6ef] p-4 rounded shadow">
        <div className="mb-3">
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">URL</label>
          <input
            type="text"
            disabled
            placeholder="(optional - currently disabled)"
            className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Text</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 h-28"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition-colors duration-150"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        <p className="mt-4 text-xs text-gray-600">
          Leave URL blank to submit a question for discussion. If there is no URL, text will appear at the top of the thread.
        </p>
      </form>
    </div>
  );
}
