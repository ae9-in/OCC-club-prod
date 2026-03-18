import { Club, ClubEvent, ClubGalleryItem, ClubMember } from "@/lib/dataProvider";

export interface ClubRecord extends Club {
  tagline: string;
  fullDescription: string;
  bannerImage: string;
  profileImage: string;
  location: string;
  university: string;
  membersCount: number;
  eventsCount: number;
  members: ClubMember[];
  events: ClubEvent[];
  gallery: ClubGalleryItem[];
}

export const mockClubs: ClubRecord[] = [
  {
    id: "club-1",
    name: "Design Circle",
    description: "A creative club for product design, branding, motion, and visual storytelling.",
    tagline: "Where ideas get shaped into beautiful work.",
    fullDescription:
      "Design Circle is a space for makers, illustrators, UI designers, and curious builders to share process, critique work, and run collaborative studio nights across campuses.",
    logo: "/globe.svg",
    bannerImage: "/window.svg",
    profileImage: "/globe.svg",
    category: "Creative",
    location: "Bangalore Studio Hub",
    university: "PES University",
    membersCount: 128,
    eventsCount: 6,
    members: [
      { id: "member-1", name: "Aarav", role: "Lead", avatar: "/globe.svg" },
      { id: "member-2", name: "Maya", role: "Designer", avatar: "/window.svg" },
      { id: "member-3", name: "Riya", role: "Motion Artist", avatar: "/file.svg" },
      { id: "member-4", name: "Kabir", role: "Brand Strategist", avatar: "/globe.svg" },
    ],
    events: [
      { id: "event-1", title: "Open Crit Night", date: "Friday, 7:00 PM", location: "Studio Lab", description: "Bring your latest UI, posters, or motion concepts for live critique." },
      { id: "event-2", title: "Portfolio Jam", date: "Sunday, 3:00 PM", location: "Design Lounge", description: "Quick reviews to tighten portfolios before applications." },
    ],
    gallery: [
      { id: "gallery-1", image: "/globe.svg", caption: "Poster sprint highlights" },
      { id: "gallery-2", image: "/window.svg", caption: "Live critique session" },
      { id: "gallery-3", image: "/file.svg", caption: "Brand workshop board" },
    ],
  },
  {
    id: "club-2",
    name: "Code Commons",
    description: "Hack nights, pair-programming, shipping side projects, and building with community.",
    tagline: "Build faster. Ship smarter. Learn together.",
    fullDescription:
      "Code Commons brings developers together for hack nights, debugging sessions, and project showcases. It is built for people who want momentum and strong peer feedback.",
    logo: "/window.svg",
    bannerImage: "/globe.svg",
    profileImage: "/window.svg",
    category: "Technology",
    location: "Innovation Block",
    university: "MIT",
    membersCount: 204,
    eventsCount: 9,
    members: [
      { id: "member-5", name: "Sana", role: "Lead", avatar: "/window.svg" },
      { id: "member-6", name: "Ishaan", role: "Frontend", avatar: "/file.svg" },
      { id: "member-7", name: "Neel", role: "Backend", avatar: "/globe.svg" },
      { id: "member-8", name: "Diya", role: "Community", avatar: "/window.svg" },
    ],
    events: [
      { id: "event-3", title: "Hack Night", date: "Wednesday, 7:00 PM", location: "Lab 4", description: "Bring your project and pair up for focused shipping." },
      { id: "event-4", title: "Bug Bash", date: "Saturday, 5:30 PM", location: "Commons Hall", description: "A high-energy debugging session with rotating pairs." },
    ],
    gallery: [
      { id: "gallery-4", image: "/window.svg", caption: "Hack night setup" },
      { id: "gallery-5", image: "/file.svg", caption: "Project showcase wall" },
    ],
  },
  {
    id: "club-3",
    name: "Startup Guild",
    description: "Founders, operators, and builders practicing pitches, product thinking, and launches.",
    tagline: "Turn experiments into ventures.",
    fullDescription:
      "Startup Guild is for students building ventures, validating ideas, and sharpening execution. Members run pitch circles, founder roundtables, and mentor office hours.",
    logo: "/file.svg",
    bannerImage: "/window.svg",
    profileImage: "/file.svg",
    category: "Social",
    location: "Entrepreneurship Hub",
    university: "Stanford",
    membersCount: 96,
    eventsCount: 4,
    members: [
      { id: "member-9", name: "Neha", role: "Lead", avatar: "/file.svg" },
      { id: "member-10", name: "Rohan", role: "Founder", avatar: "/globe.svg" },
      { id: "member-11", name: "Tara", role: "Growth", avatar: "/window.svg" },
    ],
    events: [
      { id: "event-5", title: "Pitch Practice", date: "Thursday, 6:30 PM", location: "Incubator Room", description: "Rapid-fire pitch reviews with founder feedback." },
    ],
    gallery: [
      { id: "gallery-6", image: "/file.svg", caption: "Pitch practice snapshots" },
      { id: "gallery-7", image: "/globe.svg", caption: "Mentor office hour" },
    ],
  },
];
