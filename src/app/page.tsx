"use client";

import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, MessageCircle, 
  Filter, ExternalLink, ShieldAlert, Activity 
} from 'lucide-react';
import reportData from '@/data/report.json';

// --- TYPES ---
type SentimentType = 'positive' | 'negative' | 'neutral' | 'all';

export default function MarketingDashboard() {
  const [filterSentiment, setFilterSentiment] = useState<SentimentType>('all');
  
  // Destructure data
  const { metadata, metrics, executiveSummary, topicBreakdown, sentimentData, rawPosts } = reportData;

  // Logic Filter Feed
  const filteredPosts = filterSentiment === 'all' 
    ? rawPosts 
    : rawPosts.filter(post => post.sentiment === filterSentiment);

  // Helper: Color Badge
  const getSentimentBadge = (sentiment: string) => {
    if (sentiment === 'positive') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (sentiment === 'negative') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-600 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              BK
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Brand Pulse</h1>
              <p className="text-xs text-slate-500">Marketing Intelligence Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-600 font-medium">
              📅 {metadata.period}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* 1. EXECUTIVE SUMMARY & RISK (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Summary Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <TrendingUp size={20} />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Executive Insight</h2>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {executiveSummary}
            </p>
            
            {/* Mini Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Mentions</p>
                <p className="text-2xl font-bold text-slate-800">{metadata.totalMentions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Engagement Rate</p>
                <p className="text-2xl font-bold text-slate-800">{metrics.engagementRate}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sentiment Score</p>
                <p className="text-2xl font-bold text-slate-800">{metrics.sentimentScore}</p>
              </div>
            </div>
          </div>

          {/* Risk Meter */}
          <div className={`lg:col-span-4 rounded-2xl p-6 border shadow-sm flex flex-col justify-center relative overflow-hidden
            ${metadata.riskLevel === 'High' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            
            <div className="absolute -right-4 -top-4 opacity-10">
              <ShieldAlert size={120} className={metadata.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'} />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <Activity size={18} className={metadata.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${metadata.riskLevel === 'High' ? 'text-red-700' : 'text-green-700'}`}>
                Crisis Monitor
              </h3>
            </div>
            
            <div className={`text-4xl font-black mb-2 ${metadata.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'}`}>
              {metadata.riskLevel} Risk
            </div>
            
            <p className={`text-sm leading-snug ${metadata.riskLevel === 'High' ? 'text-red-800' : 'text-green-800'}`}>
              {metadata.riskLevel === 'High' 
                ? "Spike in global boycott activity and geopolitical issues detected. Immediate 24h monitoring recommended."
                : "Brand sentiment is stable. Standard monitoring protocols apply."}
            </p>
          </div>
        </div>

        {/* 2. CHARTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sentiment Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Sentiment Distribution</h3>
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Interactive</span>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    cursor="pointer"
                    onClick={(data) => {
                      const sentiment = data.name === 'Positive' ? 'positive' : data.name === 'Negative' ? 'negative' : 'neutral';
                      setFilterSentiment(sentiment === filterSentiment ? 'all' : sentiment);
                    }}
                  >
                    {sentimentData.map((entry: any, index: number) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        strokeWidth={filterSentiment === (entry.name === 'Positive' ? 'positive' : entry.name === 'Negative' ? 'negative' : 'neutral') ? 4 : 0}
                        stroke="#000"
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Click chart slice to filter posts below</p>
          </div>

          {/* Topic Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Topic Breakdown</h3>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={topicBreakdown}
                  margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9"/>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="topic" 
                    type="category" 
                    width={120} 
                    tick={{fontSize: 11, fill: '#64748b'}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {topicBreakdown.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.sentiment === 'negative' ? '#ef4444' : entry.sentiment === 'positive' ? '#10b981' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. LIVE FEED & VISUAL GALLERY */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Filter Header */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800">
                <MessageCircle size={20} className="text-blue-500"/>
                Live Feed & Visuals
              </h3>
              <p className="text-sm text-slate-500">Real-time data from social platforms</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setFilterSentiment('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterSentiment === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilterSentiment('negative')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterSentiment === 'negative' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 border hover:bg-red-50'}`}
              >
                Risks
              </button>
              <button 
                onClick={() => setFilterSentiment('positive')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filterSentiment === 'positive' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border hover:bg-emerald-50'}`}
              >
                Wins
              </button>
            </div>
          </div>

          {/* Masonry-like Grid Layout for Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50">
            {filteredPosts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
                
                {/* Image Area */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden group">
                  <img 
                    src={post.image} 
                    alt="Post content" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border shadow-sm ${getSentimentBadge(post.sentiment)}`}>
                      {post.sentiment}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {post.user.substring(1, 3).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{post.user}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-medium uppercase">{post.topic}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                    "{post.text}"
                  </p>
                  
                  <div className="pt-3 border-t border-slate-50 mt-auto">
                    <button className="text-xs text-blue-600 font-semibold flex items-center gap-1 hover:text-blue-700 transition-colors">
                      View Source <ExternalLink size={10}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="p-16 text-center flex flex-col items-center justify-center text-slate-400">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Filter size={32} className="text-slate-300"/>
              </div>
              <p className="font-medium">No posts found for this filter.</p>
              <button onClick={() => setFilterSentiment('all')} className="text-blue-600 text-sm mt-2 font-medium hover:underline">Clear filters</button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}