"use client";

import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  Activity, MessageCircle, Mic2, 
  BarChart3, BrainCircuit, ExternalLink, 
  Lightbulb, Info
} from 'lucide-react';
import reportData from '@/data/report.json';

// --- TYPES ---
type TabType = 'overview' | 'positioning' | 'voice' | 'complexity' | 'feed';

// --- COMPONENTS ---
const InsightCard = ({ summary, suggestion }: { summary: string, suggestion: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
      <div className="mt-1"><Info className="text-blue-600" size={20} /></div>
      <div>
        <h4 className="font-bold text-blue-900 text-sm uppercase mb-1">Chart Summary</h4>
        <p className="text-blue-800 text-sm leading-relaxed">{summary}</p>
      </div>
    </div>
    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
      <div className="mt-1"><Lightbulb className="text-amber-600" size={20} /></div>
      <div>
        <h4 className="font-bold text-amber-900 text-sm uppercase mb-1">Strategic Suggestion</h4>
        <p className="text-amber-800 text-sm leading-relaxed">{suggestion}</p>
      </div>
    </div>
  </div>
);

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filterSentiment, setFilterSentiment] = useState('all');
  
  // Destructure data
  const { 
    metadata, metrics, executiveSummary, topicBreakdown, 
    sentimentData, rawPosts, positioningAnalysis, voiceAnalysis, 
    complexityAnalysis, insights 
  } = reportData as any;

  const NavButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
        activeTab === id 
          ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* --- HEADER --- */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
              TNT
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">{metadata.brand} Analysis</h1>
              <p className="text-xs text-slate-500">Market Intelligence Dashboard</p>
            </div>
          </div>
          <div className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600 hidden sm:block">
            {metadata.period}
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            <NavButton id="overview" label="Overview" icon={Activity} />
            <NavButton id="positioning" label="Positioning" icon={BarChart3} />
            <NavButton id="voice" label="Voice & Tone" icon={Mic2} />
            <NavButton id="complexity" label="Complexity" icon={BrainCircuit} />
            <NavButton id="feed" label="Live Feed" icon={MessageCircle} />
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Executive Summary */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-slate-800">Executive Insight</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{executiveSummary}</p>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Mentions</p>
                  <p className="text-2xl font-bold text-slate-900">{metadata.totalMentions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Risk Level</p>
                  <p className={`text-2xl font-bold ${metadata.riskLevel === 'Low' ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {metadata.riskLevel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Engagement</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.engagementRate}%</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sentiment Pie */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-700 mb-4">Sentiment Distribution</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={sentimentData} innerRadius={60} outerRadius={80} 
                        paddingAngle={5} dataKey="value"
                      >
                        {sentimentData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Topic Breakdown Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-700 mb-4">Topic Breakdown</h3>
                <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={topicBreakdown} margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false}/>
                      <XAxis type="number" hide />
                      <YAxis dataKey="topic" type="category" width={100} tick={{fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {topicBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.sentiment === 'positive' ? '#10b981' : entry.sentiment === 'negative' ? '#ef4444' : '#94a3b8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Insight Section for Overview */}
            <InsightCard 
              summary={insights.overview.summary} 
              suggestion={insights.overview.suggestion} 
            />
          </div>
        )}

        {/* TAB: POSITIONING */}
        {activeTab === 'positioning' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <h2 className="text-xl font-bold mb-2">Positioning Strategy</h2>
            <p className="text-slate-500 mb-8">How the brand's positioning correlates with market perception.</p>
            
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={positioningAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="category" tick={{fontSize: 12, fontWeight: 500}} />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f8fafc'}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {positioningAnalysis?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insight Section for Positioning */}
            <InsightCard 
              summary={insights.positioning.summary} 
              suggestion={insights.positioning.suggestion} 
            />
          </div>
        )}

        {/* TAB: VOICE (RADAR CHART) */}
        {activeTab === 'voice' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold mb-6">Voice Profile (Radar)</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={voiceAnalysis}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Brand Voice" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-4">Detailed Voice Metrics</h3>
                <ul className="space-y-4">
                  {voiceAnalysis?.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="text-slate-600">{item.attribute}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">{item.A}/100</span>
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500" style={{width: `${item.A}%`}}></div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Insight Section for Voice */}
            <InsightCard 
              summary={insights.voice.summary} 
              suggestion={insights.voice.suggestion} 
            />
          </div>
        )}

        {/* TAB: COMPLEXITY (SCATTER PLOT) */}
        {activeTab === 'complexity' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm animate-in fade-in duration-500">
             <div className="flex justify-between items-start mb-6">
               <div>
                 <h2 className="text-xl font-bold mb-1">Complexity Analysis</h2>
                 <p className="text-slate-500">Message Complexity (Y) vs. Usage Frequency (X)</p>
               </div>
             </div>
             
             <div className="h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                   <CartesianGrid />
                   <XAxis type="number" dataKey="frequency" name="Frequency" unit="%" label={{ value: 'Frequency', position: 'insideBottom', offset: -10 }} />
                   <YAxis type="number" dataKey="complexity" name="Complexity" unit="%" label={{ value: 'Complexity', angle: -90, position: 'insideLeft' }} />
                   <ZAxis type="number" dataKey="z" range={[100, 500]} name="Volume" />
                   <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                   <Scatter name="Topics" data={complexityAnalysis} fill="#8884d8">
                    {complexityAnalysis?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][index % 5]} />
                    ))}
                   </Scatter>
                   <Legend />
                 </ScatterChart>
               </ResponsiveContainer>
             </div>

             {/* Insight Section for Complexity */}
             <InsightCard 
               summary={insights.complexity.summary} 
               suggestion={insights.complexity.suggestion} 
             />
          </div>
        )}

        {/* TAB: LIVE FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setFilterSentiment('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterSentiment === 'all' ? 'bg-slate-800 text-white' : 'bg-white border'}`}>All</button>
              <button onClick={() => setFilterSentiment('negative')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterSentiment === 'negative' ? 'bg-red-600 text-white' : 'bg-white border'}`}>Risks</button>
              <button onClick={() => setFilterSentiment('positive')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filterSentiment === 'positive' ? 'bg-emerald-600 text-white' : 'bg-white border'}`}>Wins</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rawPosts
                .filter((p: any) => filterSentiment === 'all' || p.sentiment === filterSentiment)
                .map((post: any) => (
                <div key={post.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 bg-slate-100 relative overflow-hidden group">
                    <img src={post.image} alt="content" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-[10px] uppercase font-bold rounded-full bg-white/90 shadow-sm
                      ${post.sentiment === 'positive' ? 'text-emerald-600' : post.sentiment === 'negative' ? 'text-red-600' : 'text-slate-600'}
                    `}>
                      {post.sentiment}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">{post.topic}</p>
                    <p className="text-sm text-slate-800 line-clamp-3 leading-relaxed">"{post.text}"</p>
                    <div className="mt-4 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        {post.user}
                      </span>
                      <ExternalLink size={14} className="text-blue-500 hover:text-blue-700 cursor-pointer"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
