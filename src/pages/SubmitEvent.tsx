import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarPlus, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { addSubmission } from "@/lib/eventSubmissions";

const EVENT_TYPES = ["Workshop", "Webinar", "Training", "Meetup", "Camp", "Conference"] as const;

const SubmitEvent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>(EVENT_TYPES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [speakersLine, setSpeakersLine] = useState("");
  const [seats, setSeats] = useState("40");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const speakers = speakersLine
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (speakers.length === 0) {
      toast({ title: t("submit.toastSpeakers"), description: t("submit.toastSpeakersDesc"), variant: "destructive" });
      return;
    }
    const seatsNum = parseInt(seats, 10);
    if (Number.isNaN(seatsNum) || seatsNum < 1) {
      toast({ title: t("submit.toastSeats"), description: t("submit.toastSeatsDesc"), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const r = addSubmission({
        title,
        date,
        time,
        location,
        type,
        speakers,
        desc,
        seats: seatsNum,
        submitterName: user.name,
        submitterEmail: user.email,
      });
      if (!r.success) {
        toast({ title: t("submit.toastFail"), description: r.error, variant: "destructive" });
        return;
      }
      toast({
        title: t("submit.toastOkTitle"),
        description: t("submit.toastOkDesc"),
      });
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-10">
        <Button variant="ghost" size="sm" className="mb-6 gap-2" asChild>
          <Link to="/events">
            <ArrowLeft className="h-4 w-4" /> {t("submit.back")}
          </Link>
        </Button>

        <div className="mb-8 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
            <CalendarPlus className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              {t("submit.title")}
            </h1>
            <p className="mt-2 text-muted-foreground">{t("submit.intro")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
          <div className="space-y-2">
            <Label htmlFor="ev-title">{t("submit.fieldTitle")}</Label>
            <Input
              id="ev-title"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder={t("submit.titlePh")}
              required
              minLength={4}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("submit.type")}</Label>
            <Select value={type} onValueChange={setType} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ev-date">{t("submit.date")}</Label>
              <Input
                id="ev-date"
                value={date}
                onChange={(ev) => setDate(ev.target.value)}
                placeholder={t("submit.datePh")}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-time">{t("submit.time")}</Label>
              <Input
                id="ev-time"
                value={time}
                onChange={(ev) => setTime(ev.target.value)}
                placeholder={t("submit.timePh")}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-loc">{t("submit.location")}</Label>
            <Input
              id="ev-loc"
              value={location}
              onChange={(ev) => setLocation(ev.target.value)}
              placeholder={t("submit.locationPh")}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-speakers">{t("submit.speakers")}</Label>
            <Input
              id="ev-speakers"
              value={speakersLine}
              onChange={(ev) => setSpeakersLine(ev.target.value)}
              placeholder={t("submit.speakersPh")}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-seats">{t("submit.seats")}</Label>
            <Input
              id="ev-seats"
              type="number"
              min={1}
              max={5000}
              value={seats}
              onChange={(ev) => setSeats(ev.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-desc">{t("submit.desc")}</Label>
            <Textarea
              id="ev-desc"
              value={desc}
              onChange={(ev) => setDesc(ev.target.value)}
              placeholder={t("submit.descPh")}
              rows={5}
              required
              minLength={20}
              disabled={loading}
              className="resize-y"
            />
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("submit.submitting")}
              </>
            ) : (
              t("submit.submitBtn")
            )}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default SubmitEvent;
