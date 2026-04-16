import type { EventRegistrationItem } from "@/components/events/EventRegistrationDialog";

const STORAGE_KEY = "agrilearn_user_event_submissions_v1";
const NEXT_ID_KEY = "agrilearn_user_event_next_numeric_id";
const EVENT_REGS_KEY = "agrilearn_event_regs";

const MIN_USER_EVENT_ID = 10000;

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type UserEventSubmission = {
  submissionId: string;
  status: SubmissionStatus;
  eventId: number | null;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers: string[];
  desc: string;
  seats: number;
  registered: number;
  submitterName: string;
  submitterEmail: string;
  submittedAt: string;
};

function loadAll(): UserEventSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const p = JSON.parse(raw) as unknown;
    return Array.isArray(p) ? (p as UserEventSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveAll(items: UserEventSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  notifyEventCatalogChanged();
}

export function notifyEventCatalogChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("agrilearn-events-changed"));
}

function allocateNumericEventId(): number {
  let n = parseInt(localStorage.getItem(NEXT_ID_KEY) || String(MIN_USER_EVENT_ID), 10);
  if (Number.isNaN(n) || n < MIN_USER_EVENT_ID) n = MIN_USER_EVENT_ID;
  localStorage.setItem(NEXT_ID_KEY, String(n + 1));
  return n;
}

function countRegistrationsForEvent(eventId: number): number {
  try {
    const raw = localStorage.getItem(EVENT_REGS_KEY);
    if (!raw) return 0;
    const all = JSON.parse(raw) as Record<string, number[]>;
    let c = 0;
    for (const ids of Object.values(all)) {
      if (Array.isArray(ids) && ids.includes(eventId)) c += 1;
    }
    return c;
  } catch {
    return 0;
  }
}

export function listPendingSubmissions(): UserEventSubmission[] {
  return loadAll().filter((s) => s.status === "pending");
}

export function listApprovedForCatalog(): EventRegistrationItem[] {
  return loadAll()
    .filter((s) => s.status === "approved" && s.eventId != null)
    .map((s) => ({
      id: s.eventId!,
      title: s.title,
      date: s.date,
      time: s.time,
      location: s.location,
      type: s.type,
      speakers: s.speakers,
      desc: s.desc,
      seats: s.seats,
      registered: countRegistrationsForEvent(s.eventId!),
    }));
}

export function addSubmission(params: {
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  speakers: string[];
  desc: string;
  seats: number;
  submitterName: string;
  submitterEmail: string;
}): { success: true } | { success: false; error: string } {
  const title = params.title.trim();
  if (title.length < 4) return { success: false, error: "Title is too short." };
  if (params.seats < 1 || params.seats > 5000) return { success: false, error: "Seats must be between 1 and 5000." };

  const sub: UserEventSubmission = {
    submissionId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `sub_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    status: "pending",
    eventId: null,
    title,
    date: params.date.trim(),
    time: params.time.trim(),
    location: params.location.trim(),
    type: params.type.trim(),
    speakers: params.speakers,
    desc: params.desc.trim(),
    seats: Math.floor(params.seats),
    registered: 0,
    submitterName: params.submitterName.trim(),
    submitterEmail: params.submitterEmail.trim().toLowerCase(),
    submittedAt: new Date().toISOString(),
  };

  const all = loadAll();
  all.push(sub);
  saveAll(all);
  return { success: true };
}

export function approveSubmission(submissionId: string): { success: true } | { success: false; error: string } {
  const all = loadAll();
  const i = all.findIndex((s) => s.submissionId === submissionId);
  if (i === -1) return { success: false, error: "Submission not found." };
  if (all[i].status !== "pending") return { success: false, error: "Already reviewed." };
  const id = allocateNumericEventId();
  all[i] = { ...all[i], status: "approved", eventId: id, registered: 0 };
  saveAll(all);
  return { success: true };
}

export function rejectSubmission(submissionId: string): { success: true } | { success: false; error: string } {
  const all = loadAll();
  const i = all.findIndex((s) => s.submissionId === submissionId);
  if (i === -1) return { success: false, error: "Submission not found." };
  all[i] = { ...all[i], status: "rejected" };
  saveAll(all);
  return { success: true };
}

export function isCommunityEventId(id: number): boolean {
  return id >= MIN_USER_EVENT_ID;
}
