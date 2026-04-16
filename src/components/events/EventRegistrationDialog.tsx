import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export type EventRegistrationItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers: string[];
  desc: string;
  seats: number;
  registered: number;
};

type EventRegistrationDialogProps = {
  event: EventRegistrationItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  defaultEmail?: string;
  /** When true, email is fixed to the signed-in account (registration is stored under that email). */
  emailLocked?: boolean;
  onConfirm: (payload: { name: string; email: string; phone: string }) => Promise<void>;
};

export function EventRegistrationDialog({
  event,
  open,
  onOpenChange,
  defaultName = "",
  defaultEmail = "",
  emailLocked = false,
  onConfirm,
}: EventRegistrationDialogProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(defaultName);
      setEmail(defaultEmail);
      setPhone("");
    }
  }, [open, defaultName, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    try {
      await onConfirm({ name: name.trim(), email: email.trim(), phone: phone.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("eventDialog.title")}</DialogTitle>
          <DialogDescription>
            {event ? (
              <>
                <span className="font-medium text-foreground">{event.title}</span>
                <span className="mt-1 block text-muted-foreground">
                  {event.date} · {event.time}
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ev-reg-name">{t("eventDialog.fullName")}</Label>
            <Input
              id="ev-reg-name"
              autoComplete="name"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              placeholder="Your name"
              required
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ev-reg-email">{t("eventDialog.email")}</Label>
            <Input
              id="ev-reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              placeholder="you@example.com"
              required
              disabled={submitting || emailLocked}
              readOnly={emailLocked}
              className={emailLocked ? "bg-muted" : undefined}
            />
            <p className="text-xs text-muted-foreground">{t("eventDialog.emailHint")}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ev-reg-phone">{t("eventDialog.phone")}</Label>
            <Input
              id="ev-reg-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
              placeholder="+91 …"
              disabled={submitting}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              {t("eventDialog.cancel")}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("eventDialog.submitting")}
                </>
              ) : (
                t("eventDialog.submit")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
