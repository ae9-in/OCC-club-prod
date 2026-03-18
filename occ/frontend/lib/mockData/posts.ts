import { Post } from "@/lib/dataProvider";

export const mockPosts: Post[] = [
  {
    id: "post-1",
    clubId: "club-1",
    clubName: "Design Circle",
    clubLogo: "/globe.svg",
    author: "Aarav",
    content: "We are hosting an open critique night this Friday for anyone building apps, posters, or motion work.",
    timestamp: "2h ago",
    likes: 42,
    comments: [
      { id: "comment-1", author: "Maya", content: "Count me in." },
      { id: "comment-2", author: "Rohan", content: "Bringing my portfolio." },
    ],
  },
  {
    id: "post-2",
    clubId: "club-2",
    clubName: "Code Commons",
    clubLogo: "/window.svg",
    author: "Sana",
    content: "Hack night starts at 7 PM. Bring your side project and we will pair up for bug bashes.",
    timestamp: "5h ago",
    likes: 58,
    comments: [
      { id: "comment-3", author: "Ishaan", content: "Can freshmen join?" },
    ],
  },
  {
    id: "post-3",
    clubId: "club-3",
    clubName: "Startup Guild",
    clubLogo: "/file.svg",
    author: "Neha",
    content: "Pitch practice room is open all week. We have mentors dropping in after class for feedback.",
    timestamp: "1d ago",
    likes: 33,
    comments: [],
  },
];
