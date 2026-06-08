"use client";

import { FormEvent, useMemo, useState } from "react";

type SourceChannel = "web_form" | "email_paste" | "sms_paste" | "whatsapp_paste" | "phone_note" | "simulated";
type Status = "new" | "contacted" | "scheduled" | "completed" | "archived";
type Urgency = "low" | "medium" | "high" | "critical";
type Category =
  | "plumbing"
  | "electrical"
  | "hvac"
  | "cleaning"
  | "appointment_request"
  | "complaint"
  | "emergency"
  | "quote_request"
  | "spam_or_irrelevant"
  | "other"
  | "unclear";
type EstimatedBusinessValue = "low" | "medium" | "high" | "unknown";

type RequestRecord = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  source_channel: SourceChannel;
  original_message: string;
  location: string;
  preferred_time: string;
  self_declared_urgency: string;
  ai_summary: string;
  ai_category: Category;
  ai_urgency: Urgency;
  ai_missing_information: string[];
  ai_suggested_next_action: string;
  ai_suggested_owner_message: string;
  ai_estimated_business_value: EstimatedBusinessValue;
  ai_confidence: number;
  status: Status;
  owner_notes: string;
  is_after_hours: boolean;
  created_at: string;
  updated_at: string;
};

type IntakeFormState = {
  customer_name: string;
  phone: string;
  email: string;
  original_message: string;
  location: string;
  preferred_time: string;
  self_declared_urgency: string;
  source_channel: SourceChannel;
  owner_notes: string;
};

type SeedRequestInput = Pick<
  RequestRecord,
  | "id"
  | "customer_name"
  | "phone"
  | "email"
  | "source_channel"
  | "original_message"
  | "location"
  | "preferred_time"
  | "self_declared_urgency"
  | "status"
  | "owner_notes"
  | "created_at"
>;

const sourceLabels: Record<SourceChannel, string> = {
  web_form: "Web form",
  email_paste: "Email paste",
  sms_paste: "SMS paste",
  whatsapp_paste: "WhatsApp paste",
  phone_note: "Phone note",
  simulated: "Simulated"
};

const statusLabels: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  completed: "Completed",
  archived: "Archived"
};

const urgencyRank: Record<Urgency, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1
};

const emptyForm: IntakeFormState = {
  customer_name: "",
  phone: "",
  email: "",
  original_message: "",
  location: "",
  preferred_time: "",
  self_declared_urgency: "",
  source_channel: "web_form",
  owner_notes: ""
};

const seededRequests: RequestRecord[] = [
  createSeed({
    id: "REQ-1042",
    customer_name: "Marta Schneider",
    phone: "+49 30 4920 1187",
    email: "marta.schneider@example.de",
    source_channel: "whatsapp_paste",
    original_message:
      "Hi, our kitchen sink pipe is leaking badly and water is spreading under the cabinet. We are in Prenzlauer Berg, Stargarder Str. 22. Can someone come tonight? Please call me.",
    location: "Stargarder Str. 22, Berlin",
    preferred_time: "Tonight",
    self_declared_urgency: "Urgent",
    status: "new",
    owner_notes: "",
    created_at: "2026-06-07T20:42:00+02:00"
  }),
  createSeed({
    id: "REQ-1041",
    customer_name: "Jonas Weber",
    phone: "+49 176 4400 2911",
    email: "",
    source_channel: "phone_note",
    original_message:
      "Tenant says heating is not working in the apartment. It is an older boiler. Address is Sonnenallee 81, 12045 Berlin. Morning appointment preferred.",
    location: "Sonnenallee 81, Berlin",
    preferred_time: "Morning",
    self_declared_urgency: "",
    status: "contacted",
    owner_notes: "Ask whether hot water is also affected.",
    created_at: "2026-06-07T07:18:00+02:00"
  }),
  createSeed({
    id: "REQ-1040",
    customer_name: "Cafe Linden",
    phone: "+49 30 8812 7000",
    email: "office@cafelinden.example",
    source_channel: "email_paste",
    original_message:
      "We need a quote to replace the small restroom sink and repair a slow drain. This is not urgent but we would like an estimate this week.",
    location: "",
    preferred_time: "This week",
    self_declared_urgency: "Not urgent",
    status: "scheduled",
    owner_notes: "",
    created_at: "2026-06-06T13:05:00+02:00"
  }),
  createSeed({
    id: "REQ-1039",
    customer_name: "Anke Baumann",
    phone: "",
    email: "anke.baumann@example.de",
    source_channel: "web_form",
    original_message:
      "The bathroom drain smells bad and is slow. I am near Mitte. Please email me possible appointment times.",
    location: "Mitte, Berlin",
    preferred_time: "",
    self_declared_urgency: "",
    status: "new",
    owner_notes: "",
    created_at: "2026-06-06T22:14:00+02:00"
  }),
  createSeed({
    id: "REQ-1038",
    customer_name: "Unknown",
    phone: "",
    email: "",
    source_channel: "sms_paste",
    original_message: "Exclusive crypto opportunity. Reply YES for guaranteed profit.",
    location: "",
    preferred_time: "",
    self_declared_urgency: "",
    status: "archived",
    owner_notes: "Ignored.",
    created_at: "2026-06-06T09:35:00+02:00"
  })
];

function createSeed(input: SeedRequestInput): RequestRecord {
  const ai = classifyRequest(input);
  return {
    ...input,
    ai_summary: ai.summary,
    ai_category: ai.category,
    ai_urgency: ai.urgency,
    ai_missing_information: ai.missing_information,
    ai_suggested_next_action: ai.suggested_next_action,
    ai_suggested_owner_message: ai.suggested_owner_message,
    ai_estimated_business_value: ai.estimated_business_value,
    ai_confidence: ai.confidence,
    is_after_hours: isAfterHours(input.created_at),
    updated_at: input.created_at
  };
}

type AiResult = {
  summary: string;
  category: Category;
  urgency: Urgency;
  missing_information: string[];
  suggested_next_action: string;
  suggested_owner_message: string;
  estimated_business_value: EstimatedBusinessValue;
  confidence: number;
};

function classifyRequest(input: Pick<RequestRecord, "original_message" | "phone" | "location" | "preferred_time" | "self_declared_urgency">): AiResult {
  const text = input.original_message.toLowerCase();
  const missing = [
    !input.phone ? "phone number" : "",
    !input.location && !hasLocationHint(text) ? "address or service location" : "",
    !input.preferred_time && !/(tonight|today|tomorrow|morning|afternoon|evening|weekend|this week)/i.test(input.original_message)
      ? "preferred time"
      : ""
  ].filter(Boolean);

  const spam = /(crypto|guaranteed profit|casino|loan approval|winner|reply yes)/i.test(input.original_message);
  const leak = /(leak|leaking|water|burst|flood|pipe)/i.test(input.original_message);
  const heating = /(heating|boiler|radiator|hvac|heat pump|air conditioning|ac)/i.test(input.original_message);
  const electrical = /(electrical|sparks|socket|power|breaker|fuse)/i.test(input.original_message);
  const cleaning = /(cleaning|cleaner|deep clean|move-out)/i.test(input.original_message);
  const complaint = /(complaint|unhappy|angry|bad service|refund)/i.test(input.original_message);
  const quote = /(quote|estimate|price|cost|offer)/i.test(input.original_message);
  const emergency = /(urgent|emergency|tonight|badly|spreading|flood|sparks|smoke|lockout|no heating)/i.test(
    `${input.original_message} ${input.self_declared_urgency}`
  );

  let category: Category = "other";
  if (spam) category = "spam_or_irrelevant";
  else if (leak && emergency) category = "emergency";
  else if (leak) category = "plumbing";
  else if (heating) category = "hvac";
  else if (electrical) category = "electrical";
  else if (cleaning) category = "cleaning";
  else if (complaint) category = "complaint";
  else if (quote) category = "quote_request";
  else if (text.length < 35) category = "unclear";

  let urgency: Urgency = "medium";
  if (spam) urgency = "low";
  else if (/(flood|spreading|sparks|smoke|burst|no heating|badly)/i.test(input.original_message)) urgency = "critical";
  else if (emergency || leak || heating) urgency = "high";
  else if (quote || cleaning) urgency = "low";

  const summary = buildSummary(input.original_message, category, urgency);
  const confidence = spam ? 0.94 : category === "unclear" ? 0.48 : missing.length > 1 ? 0.72 : 0.86;

  return {
    summary,
    category,
    urgency,
    missing_information: missing,
    suggested_next_action:
      urgency === "critical"
        ? "Call the customer now, confirm the exact address, and dispatch the nearest available technician."
        : urgency === "high"
          ? "Contact the customer within 15 minutes to confirm details and offer the next available slot."
          : category === "spam_or_irrelevant"
            ? "Archive the request after a quick source check."
            : "Reply with available appointment windows and ask for any missing details.",
    suggested_owner_message:
      urgency === "critical"
        ? "Hi, we received your message and this looks urgent. I am calling you now to confirm the address and arrange help."
        : "Hi, thanks for your message. We can help. Could you confirm the missing details so we can offer the right appointment time?",
    estimated_business_value: spam ? "low" : urgency === "critical" || quote ? "high" : urgency === "high" ? "medium" : "unknown",
    confidence
  };
}

function buildSummary(message: string, category: Category, urgency: Urgency) {
  const compact = message.replace(/\s+/g, " ").trim();
  const shortened = compact.length > 92 ? `${compact.slice(0, 89)}...` : compact;
  if (category === "spam_or_irrelevant") return "Likely spam or irrelevant message.";
  if (urgency === "critical") return `Critical service request: ${shortened}`;
  if (urgency === "high") return `High-priority service request: ${shortened}`;
  return shortened;
}

function hasLocationHint(text: string) {
  return /(berlin|str\.|straße|allee|platz|ring|weg|address|near|mitte|kreuzberg|neukölln|prenzlauer|charlottenburg)/i.test(text);
}

function isAfterHours(dateValue: string) {
  const date = new Date(dateValue);
  const hour = date.getHours();
  const day = date.getDay();
  return day === 0 || day === 6 || hour < 8 || hour >= 18;
}

function createRequestFromForm(form: IntakeFormState): RequestRecord {
  const now = new Date();
  const created_at = now.toISOString();
  const ai = classifyRequest({
    original_message: form.original_message,
    phone: form.phone,
    location: form.location,
    preferred_time: form.preferred_time,
    self_declared_urgency: form.self_declared_urgency
  });

  return {
    id: `REQ-${Math.floor(1100 + Math.random() * 9000)}`,
    customer_name: form.customer_name || "Unknown",
    phone: form.phone,
    email: form.email,
    source_channel: form.source_channel,
    original_message: form.original_message,
    location: form.location,
    preferred_time: form.preferred_time,
    self_declared_urgency: form.self_declared_urgency,
    ai_summary: ai.summary,
    ai_category: ai.category,
    ai_urgency: ai.urgency,
    ai_missing_information: ai.missing_information,
    ai_suggested_next_action: ai.suggested_next_action,
    ai_suggested_owner_message: ai.suggested_owner_message,
    ai_estimated_business_value: ai.estimated_business_value,
    ai_confidence: ai.confidence,
    status: "new",
    owner_notes: form.owner_notes,
    is_after_hours: isAfterHours(created_at),
    created_at,
    updated_at: created_at
  };
}

export function SmartIntakeApp() {
  const [requests, setRequests] = useState<RequestRecord[]>(seededRequests);
  const [selectedId, setSelectedId] = useState(seededRequests[0].id);
  const [showOriginalMessage, setShowOriginalMessage] = useState(false);
  const [activeForm, setActiveForm] = useState<"customer" | "manual">("customer");
  const [form, setForm] = useState<IntakeFormState>(emptyForm);
  const [query, setQuery] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<"all" | Urgency>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const sortedRequests = useMemo(
    () => [...requests].sort((a, b) => urgencyRank[b.ai_urgency] - urgencyRank[a.ai_urgency] || +new Date(b.created_at) - +new Date(a.created_at)),
    [requests]
  );

  const filteredRequests = sortedRequests.filter((request) => {
    const haystack = `${request.customer_name} ${request.phone} ${request.email} ${request.ai_summary} ${request.original_message} ${request.ai_category}`.toLowerCase();
    return (
      haystack.includes(query.toLowerCase()) &&
      (urgencyFilter === "all" || request.ai_urgency === urgencyFilter) &&
      (statusFilter === "all" || request.status === statusFilter)
    );
  });

  const selected = requests.find((request) => request.id === selectedId) ?? sortedRequests[0];
  const metrics = {
    total: requests.length,
    new: requests.filter((request) => request.status === "new").length,
    afterHours: requests.filter((request) => request.is_after_hours).length,
    urgent: requests.filter((request) => request.ai_urgency === "high" || request.ai_urgency === "critical").length,
    contacted: requests.filter((request) => request.status === "contacted").length,
    scheduled: requests.filter((request) => request.status === "scheduled").length,
    timeSaved: Math.round(requests.length * 7)
  };

  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.original_message.trim()) return;
    const record = createRequestFromForm({
      ...form,
      source_channel: activeForm === "customer" ? "web_form" : form.source_channel
    });
    setRequests((current) => [record, ...current]);
    setSelectedId(record.id);
    setForm(emptyForm);
  }

  function updateStatus(id: string, status: Status) {
    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status, updated_at: new Date().toISOString() } : request))
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F6FA] text-[#171021]">
      <section className="border-b border-[#E6E1EC] bg-white">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-5 py-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div className="flex max-w-5xl items-start gap-4">
              <img
                alt="ProfitDelta"
                className="mt-1 h-14 w-14 rounded-lg border border-[#E7DDEA] bg-white object-contain p-1.5 shadow-sm"
                src="/assets/logo/profitdelta-symbol.png"
              />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xl font-black tracking-normal text-transparent [background:linear-gradient(135deg,#3A0B57_0%,#7B1FB5_45%,#D21B73_100%)] bg-clip-text">
                    ProfitDelta
                  </p>
                  <span className="rounded-md border border-[#E6D7EE] bg-[#FAF8FC] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#6B179C]">
                    Smart Intake
                  </span>
                </div>
                <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-normal text-[#171021] sm:text-4xl">
                  From missed messages to booked jobs.
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-[#665A72]">
                  Capture every request, preserve the original customer message, and turn messy inbound work into a prioritized owner queue.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-[#E6E1EC] bg-[#FAF8FC] p-2 text-sm font-semibold sm:flex">
              <button
                className={`rounded-md px-4 py-2 ${
                  activeForm === "customer" ? "bg-[#4B126F] text-white shadow-sm" : "text-[#665A72] hover:bg-white"
                }`}
                onClick={() => setActiveForm("customer")}
                type="button"
              >
                Customer form
              </button>
              <button
                className={`rounded-md px-4 py-2 ${
                  activeForm === "manual" ? "bg-[#4B126F] text-white shadow-sm" : "text-[#665A72] hover:bg-white"
                }`}
                onClick={() => setActiveForm("manual")}
                type="button"
              >
                Manual paste
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            <Metric label="Captured" value={metrics.total} />
            <Metric label="New" value={metrics.new} />
            <Metric label="After hours" value={metrics.afterHours} />
            <Metric label="High/Critical" value={metrics.urgent} highlight />
            <Metric label="Contacted" value={metrics.contacted} />
            <Metric label="Scheduled" value={metrics.scheduled} />
            <Metric label="Time saved" value={`${metrics.timeSaved}m`} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-5 px-5 py-5 lg:grid-cols-[360px_minmax(380px,0.9fr)_minmax(420px,1.1fr)] lg:px-8">
        <form className="grid min-w-0 content-start gap-4 rounded-lg border border-[#E6E1EC] bg-white p-4 shadow-soft" onSubmit={submitForm}>
          <div>
            <h2 className="text-lg font-bold">{activeForm === "customer" ? "Public intake" : "Paste incoming message"}</h2>
            <p className="mt-1 text-sm leading-6 text-[#665A72]">
              {activeForm === "customer"
                ? "Demo a request submitted through a simple website form."
                : "Capture email, SMS, WhatsApp, or phone notes without losing the original text."}
            </p>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Field label="Customer name" value={form.customer_name} onChange={(value) => setForm({ ...form, customer_name: value })} />
            <Field label="Phone number" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
            <Field label="Email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            {activeForm === "manual" ? (
              <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#171021]">
                Source channel
                <select
                  className="h-10 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white px-3 text-sm font-medium focus-ring"
                  value={form.source_channel}
                  onChange={(event) => setForm({ ...form, source_channel: event.target.value as SourceChannel })}
                >
                  {Object.entries(sourceLabels)
                    .filter(([key]) => key !== "web_form")
                    .map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                </select>
              </label>
            ) : null}
            <Field label="Location / address" value={form.location} onChange={(value) => setForm({ ...form, location: value })} />
            <Field label="Preferred time" value={form.preferred_time} onChange={(value) => setForm({ ...form, preferred_time: value })} />
            <Field
              label="Self-declared urgency"
              value={form.self_declared_urgency}
              onChange={(value) => setForm({ ...form, self_declared_urgency: value })}
            />
          </div>

          <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#171021]">
            Original full customer message
            <textarea
              className="min-h-36 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white p-3 text-sm leading-6 focus-ring"
              required
              value={form.original_message}
              onChange={(event) => setForm({ ...form, original_message: event.target.value })}
              placeholder="Paste or type the customer request exactly as received."
            />
          </label>

          {activeForm === "manual" ? (
            <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#171021]">
              Owner notes
              <textarea
                className="min-h-20 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white p-3 text-sm leading-6 focus-ring"
                value={form.owner_notes}
                onChange={(event) => setForm({ ...form, owner_notes: event.target.value })}
              />
            </label>
          ) : null}

          <button className="rounded-md bg-[#C0186A] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#A91460]" type="submit">
            Capture request
          </button>
        </form>

        <div className="grid content-start gap-4">
          <div className="rounded-lg border border-[#E6E1EC] bg-white p-4 shadow-soft">
            <div className="grid gap-3">
              <input
                className="h-11 w-full min-w-0 rounded-md border border-[#D8CADF] px-3 text-sm font-medium focus-ring"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search customer, message, category"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <SelectFilter
                  label="Urgency"
                  value={urgencyFilter}
                  options={["all", "critical", "high", "medium", "low"]}
                  onChange={(value) => setUrgencyFilter(value as "all" | Urgency)}
                />
                <SelectFilter
                  label="Status"
                  value={statusFilter}
                  options={["all", "new", "contacted", "scheduled", "completed", "archived"]}
                  onChange={(value) => setStatusFilter(value as "all" | Status)}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredRequests.map((request) => (
              <button
                key={request.id}
                className={`rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-[#9B2BC9] ${
                  request.id === selected?.id ? "border-[#9B2BC9] ring-2 ring-[#9B2BC9]/15" : "border-[#E6E1EC]"
                }`}
                onClick={() => {
                  setSelectedId(request.id);
                  setShowOriginalMessage(false);
                }}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#171021]">{request.customer_name}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#665A72]">{request.ai_summary}</p>
                  </div>
                  <UrgencyBadge urgency={request.ai_urgency} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#7A6E83]">
                  <span>{request.ai_category.replaceAll("_", " ")}</span>
                  <span>{sourceLabels[request.source_channel]}</span>
                  <span>{formatTime(request.created_at)}</span>
                  {request.is_after_hours ? <span className="rounded bg-[#F4EAF8] px-2 py-1 text-[#7B1FB5]">After hours</span> : null}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <StatusBadge status={request.status} />
                  <select
                    className="h-9 rounded-md border border-[#D8CADF] bg-white px-2 text-xs font-semibold focus-ring"
                    value={request.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => updateStatus(request.id, event.target.value as Status)}
                  >
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selected ? (
          <RequestDetail
            request={selected}
            showOriginalMessage={showOriginalMessage}
            onStatusChange={(status) => updateStatus(selected.id, status)}
            onToggleOriginalMessage={() => setShowOriginalMessage((current) => !current)}
          />
        ) : null}
      </section>
    </main>
  );
}

function Metric({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${highlight ? "border-[#C0186A]/30 bg-[#FFF1F7]" : "border-[#E6E1EC] bg-[#FAF8FC]"}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7A6E83]">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-normal text-[#171021]">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid min-w-0 gap-1 text-sm font-semibold text-[#171021]">
      {label}
      <input
        className="h-10 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white px-3 text-sm font-medium focus-ring"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.1em] text-[#7A6E83]">
      {label}
      <select
        className="h-10 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white px-3 text-sm font-semibold normal-case tracking-normal text-[#171021] focus-ring"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All" : option.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function RequestDetail({
  request,
  showOriginalMessage,
  onStatusChange,
  onToggleOriginalMessage
}: {
  request: RequestRecord;
  showOriginalMessage: boolean;
  onStatusChange: (status: Status) => void;
  onToggleOriginalMessage: () => void;
}) {
  return (
    <aside className="grid content-start gap-4 rounded-lg border border-[#E6E1EC] bg-white p-5 shadow-soft">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#7B1FB5]">{request.id}</p>
          <h2 className="mt-1 text-2xl font-bold tracking-normal text-[#171021]">{request.customer_name}</h2>
          <p className="mt-1 text-sm text-[#665A72]">{sourceLabels[request.source_channel]} · {formatTime(request.created_at)}</p>
        </div>
        <UrgencyBadge urgency={request.ai_urgency} />
      </div>

      <section className="grid gap-4 rounded-lg border border-[#E6E1EC] bg-[#FAF8FC] p-4">
        <DetailRow label="AI summary" value={request.ai_summary} />
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailRow label="Category" value={request.ai_category.replaceAll("_", " ")} />
          <DetailRow label="Confidence" value={`${Math.round(request.ai_confidence * 100)}%`} />
          <DetailRow label="Estimated value" value={request.ai_estimated_business_value} />
          <DetailRow label="After hours" value={request.is_after_hours ? "Yes" : "No"} />
        </div>
        <DetailRow
          label="Missing information"
          value={request.ai_missing_information.length ? request.ai_missing_information.join(", ") : "No obvious missing details"}
        />
      </section>

      <section className="rounded-lg border border-[#E6E1EC] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7A6E83]">Next action</p>
        <p className="mt-2 text-base font-bold leading-7 text-[#171021]">{request.ai_suggested_next_action}</p>
        <div className="mt-4 rounded-md bg-[#F7F1FA] p-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7A6E83]">Suggested owner reply</p>
          <p className="mt-2 text-sm leading-6 text-[#171021]">{request.ai_suggested_owner_message}</p>
        </div>
      </section>

      <section className="rounded-lg border-2 border-[#4B126F] bg-[#FCFAFF] p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#4B126F]">Original customer message</p>
            <p className="mt-1 text-sm leading-6 text-[#665A72]">Source of truth. Use this to verify the AI summary before acting.</p>
          </div>
          <button
            className="rounded-md border border-[#D8CADF] bg-white px-3 py-2 text-sm font-bold text-[#4B126F] hover:bg-[#F7F1FA]"
            onClick={onToggleOriginalMessage}
            type="button"
          >
            {showOriginalMessage ? "Hide full message" : "Show full message"}
          </button>
        </div>
        <p className={`mt-3 whitespace-pre-wrap text-base leading-7 text-[#171021] ${showOriginalMessage ? "" : "line-clamp-3"}`}>
          {request.original_message}
        </p>
      </section>

      <section className="grid gap-3 rounded-lg border border-[#E6E1EC] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7A6E83]">Customer contact details</p>
        <div className="grid gap-2 text-sm">
          <ContactLine label="Phone" value={request.phone || "Missing"} />
          <ContactLine label="Email" value={request.email || "Missing"} />
          <ContactLine label="Location" value={request.location || "Missing"} />
          <ContactLine label="Preferred time" value={request.preferred_time || "Missing"} />
        </div>
      </section>

      <section className="grid gap-3 rounded-lg border border-[#E6E1EC] p-4">
        <label className="grid gap-1 text-sm font-semibold">
          Status
          <select
            aria-label="Request status"
            className="h-11 w-full min-w-0 rounded-md border border-[#D8CADF] bg-white px-3 text-sm font-semibold focus-ring"
            value={request.status}
            onChange={(event) => onStatusChange(event.target.value as Status)}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <DetailRow label="Owner notes" value={request.owner_notes || "No owner notes yet"} />
      </section>
    </aside>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#7A6E83]">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#171021]">{value}</p>
    </div>
  );
}

function ContactLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#EFE8F2] pb-2 last:border-0 last:pb-0">
      <span className="font-semibold text-[#665A72]">{label}</span>
      <span className="text-right font-bold text-[#171021]">{value}</span>
    </div>
  );
}

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const classes: Record<Urgency, string> = {
    critical: "border-[#C0186A] bg-[#FFF1F7] text-[#A91460]",
    high: "border-[#7B1FB5] bg-[#F4EAF8] text-[#6B179C]",
    medium: "border-[#5E3BD6] bg-[#EFECFF] text-[#4C2BB3]",
    low: "border-[#667085] bg-[#F2F4F7] text-[#475467]"
  };

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] ${classes[urgency]}`}>{urgency}</span>;
}

function StatusBadge({ status }: { status: Status }) {
  return <span className="rounded-md bg-[#F0E8F4] px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#665A72]">{statusLabels[status]}</span>;
}

function formatTime(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}
