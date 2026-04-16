import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Leaf, Users, FilePen, ArrowLeft, CalendarCheck, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import {
  approveSubmission,
  listPendingSubmissions,
  rejectSubmission,
  type UserEventSubmission,
} from "@/lib/eventSubmissions";

const Admin = () => {
  const { user, listUsers, setUserCanPost } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [, setVersion] = useState(0);

  const rows = listUsers();
  const refresh = () => setVersion((v) => v + 1);

  const [pendingEvents, setPendingEvents] = useState<UserEventSubmission[]>(() => listPendingSubmissions());

  const refreshPendingEvents = () => setPendingEvents(listPendingSubmissions());

  const handleApproveEvent = (submissionId: string) => {
    const r = approveSubmission(submissionId);
    if (!r.success) {
      toast({ title: t("admin.evFail"), description: r.error, variant: "destructive" });
      return;
    }
    toast({ title: t("admin.evApproveOk"), description: t("admin.evApproveOkDesc") });
    refreshPendingEvents();
  };

  const handleRejectEvent = (submissionId: string) => {
    const r = rejectSubmission(submissionId);
    if (!r.success) {
      toast({ title: t("admin.evRejectFail"), description: r.error, variant: "destructive" });
      return;
    }
    toast({ title: t("admin.evRejectOk"), description: t("admin.evRejectOkDesc") });
    refreshPendingEvents();
  };

  const handleToggle = (email: string, next: boolean) => {
    const r = setUserCanPost(email, next);
    if (!r.success) {
      toast({ title: t("admin.toastUpdateFail"), description: r.error, variant: "destructive" });
      return;
    }
    toast({
      title: next ? t("admin.toastPostOn") : t("admin.toastPostOff"),
      description: next ? t("admin.toastPostOnDesc", { email }) : t("admin.toastPostOffDesc", { email }),
    });
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">{t("nav.admin")}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              {t("admin.permTitle")}
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">{t("admin.permDesc")}</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("admin.back")}
            </Link>
          </Button>
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-4 shadow-card md:p-5">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" /> {t("admin.signedIn")}{" "}
              <strong className="text-foreground">{user?.name}</strong>
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" /> {rows.length} {t("admin.accounts")}
            </span>
          </div>
        </div>

        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {t("admin.eventsTitle")}
              </h2>
              <p className="text-sm text-muted-foreground">{t("admin.eventsDesc")}</p>
            </div>
          </div>

          {pendingEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("admin.eventsEmpty")}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-foreground">{t("admin.evTitle")}</th>
                      <th className="px-4 py-3 font-semibold text-foreground">{t("admin.evType")}</th>
                      <th className="px-4 py-3 font-semibold text-foreground">{t("admin.evWhenWhere")}</th>
                      <th className="px-4 py-3 font-semibold text-foreground">{t("admin.evBy")}</th>
                      <th className="px-4 py-3 font-semibold text-foreground">{t("admin.evActions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEvents.map((p) => (
                      <tr key={p.submissionId} className="border-b border-border last:border-0">
                        <td className="max-w-[200px] px-4 py-3 align-top">
                          <span className="font-medium text-foreground">{p.title}</span>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.desc}</p>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <Badge variant="outline">{p.type}</Badge>
                        </td>
                        <td className="px-4 py-3 align-top text-muted-foreground">
                          <span className="block whitespace-nowrap">{p.date}</span>
                          <span className="block text-xs">{p.time}</span>
                          <span className="mt-1 block text-xs">{p.location}</span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className="block text-foreground">{p.submitterName}</span>
                          <span className="text-xs text-muted-foreground">{p.submitterEmail}</span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" className="gap-1" onClick={() => handleApproveEvent(p.submissionId)}>
                              <CalendarCheck className="h-3.5 w-3.5" /> {t("admin.evApprove")}
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1" onClick={() => handleRejectEvent(p.submissionId)}>
                              <XCircle className="h-3.5 w-3.5" /> {t("admin.evReject")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 font-semibold text-foreground">{t("admin.userCol")}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{t("admin.emailCol")}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">{t("admin.roleCol")}</th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FilePen className="h-3.5 w-3.5" /> {t("admin.canPostCol")}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isAdmin = row.role === "admin";
                  const isSelf = row.email.toLowerCase() === user?.email.toLowerCase();
                  return (
                    <tr key={row.email} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <Badge>{t("admin.roleAdmin")}</Badge>
                        ) : (
                          <Badge variant="outline">{t("admin.roleMember")}</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <span className="text-xs text-muted-foreground">{t("admin.alwaysAllowed")}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={row.canPostArticles}
                              disabled={isSelf}
                              onCheckedChange={(v) => handleToggle(row.email, v)}
                              aria-label={`Allow ${row.email} to post`}
                            />
                            <span className="text-xs text-muted-foreground">
                              {isSelf
                                ? t("admin.yourAccount")
                                : row.canPostArticles
                                  ? t("admin.enabled")
                                  : t("admin.disabled")}
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
