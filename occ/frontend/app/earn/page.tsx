"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  GraduationCap, 
  Users, 
  BookOpen, 
  ShoppingBag, 
  Heart, 
  Target, 
  Shield, 
  Brain,
  Search,
  IndianRupee,
  MapPin,
  Clock,
  User
} from "lucide-react";

// Mock data for opportunities
const mockOpportunities = {
  competitions: [
    {
      id: 1,
      title: "Startup Pitch Competition",
      description: "Present your startup idea to industry experts",
      reward: "₹25,000",
      host: "Entrepreneurship Circle",
      location: "Main Auditorium",
      status: "open"
    },
    {
      id: 2,
      title: "AI Hackathon 2026",
      description: "48-hour coding challenge focused on AI solutions",
      reward: "₹50,000",
      host: "Tech Club",
      location: "Computer Lab",
      status: "open"
    }
  ],
  tuitions: [
    {
      id: 3,
      title: "Data Structures Tutoring",
      description: "One-on-one tutoring for DSA concepts",
      reward: "₹500/hour",
      host: "Rahul Sharma",
      location: "Online",
      status: "available"
    },
    {
      id: 4,
      title: "Python Programming Basics",
      description: "Learn Python from scratch with practical projects",
      reward: "₹300/hour",
      host: "Priya Patel",
      location: "Library Study Room",
      status: "available"
    }
  ],
  hiring: [
    {
      id: 5,
      title: "Software Engineer Referral",
      description: "Refer candidates for full-stack developer positions",
      reward: "₹5,000",
      host: "TechCorp Solutions",
      location: "Remote",
      status: "active"
    }
  ],
  training: [
    {
      id: 6,
      title: "Python for Beginners Workshop",
      description: "3-day intensive Python programming workshop",
      reward: "₹299",
      host: "Coding Club",
      location: "Lab 101",
      status: "upcoming"
    }
  ],
  shop: [
    {
      id: 7,
      title: "Startup Club Hoodie",
      description: "Premium quality hoodie with club branding",
      reward: "₹799",
      host: "Startup Club",
      location: "Campus Store",
      status: "available"
    }
  ],
  ace: [
    {
      id: 8,
      title: "Tech Resume Review",
      description: "Professional resume review and feedback",
      reward: "₹200",
      host: "Career Services",
      location: "Online",
      status: "available"
    }
  ],
  etiquette: [
    {
      id: 9,
      title: "POSH Compliance Training Referral",
      description: "Refer companies for workplace harassment training",
      reward: "₹8,000 - ₹25,000",
      host: "OCC Training",
      location: "Corporate",
      status: "active"
    }
  ],
  psychology: [
    {
      id: 10,
      title: "Marketing Psychology Masterclass",
      description: "Learn consumer behavior and marketing psychology",
      reward: "₹499",
      host: "Business Club",
      location: "Seminar Hall",
      status: "upcoming"
    }
  ]
};

const verticals = [
  {
    id: "competitions",
    title: "Competitions",
    description: "Earn prize money through hackathons, pitch competitions, and challenges",
    icon: Trophy,
    example: "₹25,000 prize pools",
    opportunities: mockOpportunities.competitions
  },
  {
    id: "tuitions",
    title: "Crescentia + Private Tuitions",
    description: "Monetize your knowledge by tutoring and mentoring students",
    icon: GraduationCap,
    example: "₹500/hour tutoring",
    opportunities: mockOpportunities.tuitions
  },
  {
    id: "hiring",
    title: "Hiring",
    description: "Earn referral rewards by connecting candidates with companies",
    icon: Users,
    example: "₹5,000 per hire",
    opportunities: mockOpportunities.hiring
  },
  {
    id: "training",
    title: "Training",
    description: "Host workshops, bootcamps, and skill development sessions",
    icon: BookOpen,
    example: "₹299 per workshop",
    opportunities: mockOpportunities.training
  },
  {
    id: "shop",
    title: "Shop Community",
    description: "Sell products, merchandise, and digital assets to students",
    icon: ShoppingBag,
    example: "₹799 merchandise",
    opportunities: mockOpportunities.shop
  },
  {
    id: "ace",
    title: "Ace It Up",
    description: "Offer skill improvement and career development services",
    icon: Target,
    example: "₹200 per review",
    opportunities: mockOpportunities.ace
  },
  {
    id: "etiquette",
    title: "Etiquette",
    description: "Refer companies for compliance and workplace training programs",
    icon: Shield,
    example: "₹8,000-₹25,000 commission",
    opportunities: mockOpportunities.etiquette
  },
  {
    id: "psychology",
    title: "Business Psychology",
    description: "Teach behavioral economics and marketing psychology concepts",
    icon: Brain,
    example: "₹499 per session",
    opportunities: mockOpportunities.psychology
  }
];

export default function EarnPage() {
  const [selectedVertical, setSelectedVertical] = useState<string | null>(null);
  const [userEarnings] = useState({
    total: 5450,
    thisMonth: 2300,
    completed: 4,
    pending: 2
  });

  const OpportunityCard = ({ opportunity }: { opportunity: any }) => (
    <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_rgba(37,64,255,0.3)] hover:-translate-y-1 transition-all">
      <h3 className="text-xl font-black uppercase mb-3">{opportunity.title}</h3>
      <p className="font-bold text-gray-700 mb-4">{opportunity.description}</p>
      
      <div className="flex items-center gap-4 mb-4 text-sm font-bold">
        <div className="flex items-center gap-1 text-brutal-blue">
          <IndianRupee className="w-4 h-4" />
          <span>{opportunity.reward}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>{opportunity.host}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{opportunity.location}</span>
        </div>
      </div>
      
      <button className="bg-black text-white px-6 py-3 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all w-full">
        Apply →
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brutal-gray">
      {/* Page Header */}
      <div className="bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6">
              Earn on OCC
            </h1>
            <p className="text-2xl font-bold text-gray-700 mb-8 max-w-3xl mx-auto">
              Turn your skills, network, and knowledge into income through our comprehensive earning ecosystem.
            </p>
            
            <div className="flex justify-center">
              <button className="bg-black text-white px-8 py-4 font-black uppercase text-lg border-4 border-black shadow-[8px_8px_0_0_#1d2cf3] hover:shadow-[12px_12px_0_0_#1d2cf3] hover:-translate-y-1 transition-all flex items-center gap-3">
                <Search className="w-6 h-6" /> Browse Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* User Earnings Panel */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] mb-16">
          <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">
            Your Earnings Dashboard
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-brutal-blue mb-2">₹{userEarnings.total.toLocaleString()}</div>
              <div className="font-black uppercase text-sm text-gray-600">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brutal-blue mb-2">₹{userEarnings.thisMonth.toLocaleString()}</div>
              <div className="font-black uppercase text-sm text-gray-600">This Month</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brutal-blue mb-2">{userEarnings.completed}</div>
              <div className="font-black uppercase text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-brutal-blue mb-2">{userEarnings.pending}</div>
              <div className="font-black uppercase text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>

        {/* Earning Verticals Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-black uppercase mb-12 text-center">
            Earning Verticals
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {verticals.map((vertical) => {
              const IconComponent = vertical.icon;
              return (
                <div
                  key={vertical.id}
                  className={`bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000] hover:shadow-[12px_12px_0_0_rgba(37,64,255,0.3)] hover:-translate-y-2 transition-all cursor-pointer ${
                    selectedVertical === vertical.id ? 'ring-4 ring-brutal-blue' : ''
                  }`}
                  onClick={() => setSelectedVertical(selectedVertical === vertical.id ? null : vertical.id)}
                >
                  <div className="flex items-start gap-6 mb-6">
                    <div className="bg-brutal-blue text-white p-4 border-4 border-black shadow-[4px_4px_0_0_#000]">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase mb-3">{vertical.title}</h3>
                      <p className="font-bold text-gray-700 mb-4">{vertical.description}</p>
                      <div className="text-brutal-blue font-black text-lg">{vertical.example}</div>
                    </div>
                  </div>
                  
                  <button className="bg-black text-white px-6 py-3 font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all w-full">
                    View Opportunities ({vertical.opportunities.length})
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Vertical Opportunities */}
        {selectedVertical && (
          <div className="mb-16">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
              <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                {verticals.find(v => v.id === selectedVertical)?.title} Opportunities
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {verticals.find(v => v.id === selectedVertical)?.opportunities.map((opportunity) => (
                  <OpportunityCard key={opportunity.id} opportunity={opportunity} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Opportunities */}
        <div className="mb-16">
          <h2 className="text-4xl font-black uppercase mb-12 text-center">
            Featured Opportunities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <OpportunityCard opportunity={mockOpportunities.competitions[0]} />
            <OpportunityCard opportunity={mockOpportunities.tuitions[0]} />
            <OpportunityCard opportunity={mockOpportunities.hiring[0]} />
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="text-3xl font-black uppercase mb-8 border-b-4 border-black pb-4">
            How Earning Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brutal-blue text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4 border-4 border-black">
                1
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Choose Your Vertical</h3>
              <p className="font-bold text-gray-700">Select from 8 different earning categories based on your skills and interests.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brutal-blue text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4 border-4 border-black">
                2
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Apply or Create</h3>
              <p className="font-bold text-gray-700">Apply to existing opportunities or create your own earning opportunities.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-brutal-blue text-white w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4 border-4 border-black">
                3
              </div>
              <h3 className="text-xl font-black uppercase mb-3">Earn & Track</h3>
              <p className="font-bold text-gray-700">Complete opportunities and track your earnings through your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}