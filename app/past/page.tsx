// "use client";
// import { useEffect, useState } from "react";
// import { format, subDays } from "date-fns";

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
// }

// const PastPostsPage = () => {
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [page, setPage] = useState(1);
//   const limit = 5;

//   const [beforeDate, setBeforeDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));

//   useEffect(() => {
//     fetchPosts(page, beforeDate);
//   }, [page, beforeDate]);

//   const fetchPosts = async (pageNum: number, date: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `http://localhost:3000/posts/pastposts?before=${encodeURIComponent(date)}&page=${pageNum}&limit=${limit}`,
//         {
//           credentials: "include",
//         }
//       );

//       if (!res.ok) {
//         const errText = await res.text();
//         console.error("❌ Server responded with:", res.status, errText);
//         return;
//       }

//       const data = await res.json();
//       setPosts(data.data);
//       setTotalPages(data.pagination.totalPages);
//     } catch (err) {
//       console.error("❌ Fetch failed completely:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadMorePosts = () => {
//     if (page < totalPages) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

//   const handleChangeDate = (days: number) => {
//     const newDate = subDays(new Date(), days);
//     setBeforeDate(format(newDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
//     setPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-white p-4">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">Past Posts</h1>

//         <div className="flex gap-3 mb-6 flex-wrap">
//           <button
//             onClick={() => handleChangeDate(1)}
//             className="border border-black text-black text-sm px-4 py-2 rounded hover:bg-orange-400"
//           >
//             1 Day Ago
//           </button>
//           <button
//             onClick={() => handleChangeDate(30)}
//             className="border border-black text-black text-sm px-4 py-2 rounded hover:bg-orange-400"
//           >
//             1 Month Ago
//           </button>
//           <button
//             onClick={() => handleChangeDate(365)}
//             className="border border-black text-black text-sm px-4 py-2 rounded hover:bg-orange-400"
//           >
//             1 Year Ago
//           </button>
//         </div>

//         {loading && <p className="text-center text-gray-500">Loading...</p>}

//         <div className="space-y-4">
//           {posts.length === 0 ? (
//             <p className="text-center text-gray-500">No posts found for this period.</p>
//           ) : (
//             posts.map((post) => (
//               <div
//                 key={post.id}
//                 className="border p-4 rounded"
//               >
//                 <h2 className="text-lg font-semibold text-gray-700">{post.title}</h2>
//                 <p className="text-gray-600 text-sm mt-1">{post.content}</p>
//                 <p className="text-xs text-gray-400 mt-2">
//                   {new Date(post.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>

//         {page < totalPages && (
//           <div className="mt-6 flex justify-center">
//             <button
//               onClick={loadMorePosts}
//               disabled={loading}
//               className="bg-orange-500 text-white text-sm px-5 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
//             >
//               {loading ? "Loading..." : "Load More"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PastPostsPage;
