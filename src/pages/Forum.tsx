import { useState } from "react";
import { MessageSquare, ThumbsUp, Clock, User, Send, Search, ChevronDown, ChevronUp, Reply } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const ANON_AUTHOR = "Anonymous";
const TIME_JUST_NOW = "Just now";

interface ForumReply {
  author: string;
  time: string;
  text: string;
}

interface ForumPost {
  id: number;
  author: string;
  time: string;
  category: string;
  title: string;
  body: string;
  replies: ForumReply[];
  likes: number;
}

const initialPosts: ForumPost[] = [
  {
    id: 1, author: "Ramesh Kumar", time: "2 hours ago", category: "Composting",
    title: "Best composting method for small farms?",
    body: "I have a 2-acre farm and want to start composting. Should I go with pit composting or vermicomposting? Any suggestions from experienced farmers?",
    replies: [
      { author: "Dr. Priya Sharma", time: "1 hour ago", text: "For a 2-acre farm, I'd recommend starting with vermicomposting. It's faster (45-60 days) and produces higher quality compost. You can start with just 2-3 pits." },
      { author: "Suresh Patel", time: "30 min ago", text: "I use both! Pit composting for bulk waste and vermicomposting for kitchen waste. Works great together." },
    ],
    likes: 12,
  },
  {
    id: 2, author: "Anita Devi", time: "5 hours ago", category: "Pest Control",
    title: "Aphids destroying my mustard crop - need help!",
    body: "My mustard crop is severely affected by aphids this season. I've tried neem spray but it's not working well. What else can I try organically?",
    replies: [
      { author: "AgriExpert_Raj", time: "4 hours ago", text: "Try mixing neem oil with garlic extract. Also, release ladybugs if available — they eat aphids voraciously. Spray in the evening for best results." },
    ],
    likes: 8,
  },
  {
    id: 3, author: "Vijay Singh", time: "1 day ago", category: "Soil Health",
    title: "How to improve clay soil for organic farming?",
    body: "My farm has heavy clay soil that gets waterlogged easily. What organic amendments can I use to improve drainage and soil structure?",
    replies: [
      { author: "Prof. Kumar", time: "20 hours ago", text: "Add coarse compost, rice husk, and green manure crops like dhaincha. Over 2-3 seasons, the soil structure will improve significantly." },
      { author: "Meena Farmer", time: "18 hours ago", text: "Gypsum also helps with clay soil. And raised beds work wonders for drainage!" },
      { author: "Vijay Singh", time: "15 hours ago", text: "Thank you both! I'll try the raised beds approach with compost amendment this season." },
    ],
    likes: 15,
  },
  {
    id: 4, author: "Sunita Bai", time: "2 days ago", category: "Crop Management",
    title: "When to start Kharif sowing in Maharashtra?",
    body: "First-time organic farmer here. When should I start preparing my land and sowing for Kharif season? I plan to grow soybean and cotton organically.",
    replies: [
      { author: "Dr. Priya Sharma", time: "1 day ago", text: "Start land preparation by mid-May. For soybean, sow after the first good rain (usually mid-June). Treat seeds with Rhizobium and PSB cultures before sowing." },
      { author: "Ramesh Kumar", time: "1 day ago", text: "For organic cotton, I recommend planting desi varieties. They are more pest-resistant. Sow in June-July." },
    ],
    likes: 10,
  },
];

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const { user } = useAuth();
  const { t } = useLanguage();

  const labelAuthor = (name: string) => (name === ANON_AUTHOR ? t("forum.anonymous") : name);
  const labelTime = (time: string) => (time === TIME_JUST_NOW ? t("forum.justNow") : time);

  const filtered = posts.filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.body.toLowerCase().includes(search.toLowerCase())
  );

  const handlePost = () => {
    if (!newTitle.trim() || !newBody.trim()) return;
    setPosts([
      {
        id: Date.now(),
        author: user ? user.name : ANON_AUTHOR,
        time: TIME_JUST_NOW,
        category: "General",
        title: newTitle,
        body: newBody,
        replies: [],
        likes: 0,
      },
      ...posts,
    ]);
    setNewTitle("");
    setNewBody("");
    setShowForm(false);
  };

  const handleReply = (postId: number) => {
    if (!replyText.trim()) return;
    setPosts(posts.map(p => p.id === postId ? {
      ...p,
      replies: [...p.replies, { author: user ? user.name : ANON_AUTHOR, time: TIME_JUST_NOW, text: replyText }]
    } : p));
    setReplyText("");
    setReplyingTo(null);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("forum.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("forum.subtitle")}</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <MessageSquare className="mr-2 h-4 w-4" /> {t("forum.newPost")}
          </Button>
        </div>

        {showForm && (
          <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-card animate-fade-in">
            <h3 className="mb-4 font-semibold text-foreground">{t("forum.createPost")}</h3>
            {!user && <p className="mb-3 text-sm text-destructive">{t("forum.anonWarn")}</p>}
            <Input placeholder={t("forum.titlePh")} className="mb-3" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Textarea
              placeholder={t("forum.bodyPh")}
              className="mb-3"
              rows={4}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handlePost}>
                <Send className="mr-2 h-4 w-4" />
                {t("forum.post")}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t("forum.cancel")}
              </Button>
            </div>
          </div>
        )}

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("forum.searchPh")} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((post) => (
            <div key={post.id} className={`rounded-xl border bg-card p-6 shadow-card transition-all ${expandedPost === post.id ? "border-primary" : "border-border"}`}>
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium text-foreground">{labelAuthor(post.author)}</span>
                <Clock className="h-3 w-3" /> {labelTime(post.time)}
                <Badge variant="secondary" className="ml-auto">{t(`cat.${post.category}`)}</Badge>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}>
                {post.title}
              </h3>
              <p className={`mb-4 text-sm text-muted-foreground ${expandedPost !== post.id ? "line-clamp-2" : ""}`}>{post.body}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" /> {post.likes}
                </button>
                <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="flex items-center gap-1 hover:text-primary transition-colors">
                  <MessageSquare className="h-4 w-4" /> {post.replies.length} {t("forum.replies")}
                  {expandedPost === post.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                <button onClick={() => { setExpandedPost(post.id); setReplyingTo(post.id); }}
                  className="flex items-center gap-1 hover:text-primary transition-colors ml-auto">
                  <Reply className="h-4 w-4" /> {t("forum.reply")}
                </button>
              </div>

              {expandedPost === post.id && (
                <div className="mt-4 animate-fade-in">
                  {post.replies.length > 0 && (
                    <div className="space-y-3 border-l-2 border-primary/20 pl-4">
                      {post.replies.map((r, i) => (
                        <div key={i} className="rounded-lg bg-secondary/50 p-3">
                          <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="font-medium text-foreground">{labelAuthor(r.author)}</span> · {labelTime(r.time)}
                          </div>
                          <p className="text-sm text-foreground">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyingTo === post.id && (
                    <div className="mt-4 flex gap-2">
                      <Textarea placeholder={t("forum.replyPh")} className="flex-1" rows={2} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                      <div className="flex flex-col gap-1">
                        <Button size="sm" onClick={() => handleReply(post.id)}><Send className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>✕</Button>
                      </div>
                    </div>
                  )}
                  {replyingTo !== post.id && (
                    <Button variant="outline" size="sm" className="mt-3" onClick={() => setReplyingTo(post.id)}>
                      <Reply className="mr-1 h-4 w-4" /> {t("forum.writeReplyBtn")}
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">{t("forum.noResults")}</div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Forum;
