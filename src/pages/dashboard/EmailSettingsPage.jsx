import { Save, ShieldCheck, TestTube2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import PageHeader from "../../components/common/PageHeader.jsx";
import { fetchEmailSettings, sendTestEmail, updateEmailSettings, verifyEmailConfig } from "../../features/emails/emailSlice.js";

const rowClass = "flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3";

const EmailSettingsPage = () => {
  const dispatch = useDispatch();
  const { settings, providerStatus, saving, sending } = useSelector((state) => state.emails);
  const [form, setForm] = useState(null);
  const [testTo, setTestTo] = useState("hr@hiresmart.com");

  useEffect(() => {
    dispatch(fetchEmailSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const save = async (event) => {
    event.preventDefault();
    try {
      await dispatch(updateEmailSettings(form)).unwrap();
      toast.success("Email settings saved");
    } catch (error) {
      toast.error(error || "Unable to save settings");
    }
  };

  const verify = async () => {
    try {
      await dispatch(verifyEmailConfig()).unwrap();
      toast.success("Email configuration verified");
    } catch (error) {
      toast.error(error || "Unable to verify email configuration");
    }
  };

  const test = async () => {
    try {
      await dispatch(sendTestEmail({ to: testTo })).unwrap();
      toast.success("Test email processed");
    } catch (error) {
      toast.error(error || "Unable to send test email");
    }
  };

  if (!form) return null;

  return (
    <div>
      <PageHeader title="Email Settings" description="Configure non-secret sender preferences and verify mock or SMTP mail provider status." />
      <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Sender name" value={form.senderName || ""} onChange={(event) => setField("senderName", event.target.value)} />
            <Input label="Sender email" type="email" value={form.senderEmail || ""} onChange={(event) => setField("senderEmail", event.target.value)} />
            <Input label="Reply-to email" type="email" value={form.replyToEmail || ""} onChange={(event) => setField("replyToEmail", event.target.value)} />
            <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Provider</span><select className="h-11 w-full rounded-lg border border-slate-300 px-3" value={form.provider || "mock"} onChange={(event) => setField("provider", event.target.value)}><option value="mock">Mock</option><option value="smtp">SMTP</option></select></label>
            <Input label="Reminder hours" type="number" value={form.defaultReminderHours || 24} onChange={(event) => setField("defaultReminderHours", Number(event.target.value))} />
          </div>
          <label className="space-y-2 text-sm font-semibold text-slate-700"><span>Footer text</span><textarea className="min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.footerText || ""} onChange={(event) => setField("footerText", event.target.value)} /></label>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["emailAutomationEnabled", "Email automation enabled"],
              ["interviewInvitationsEnabled", "Auto interview invitations"],
              ["interviewRemindersEnabled", "Interview reminders"],
              ["candidateStatusEmailsEnabled", "Auto candidate status emails"]
            ].map(([key, label]) => (
              <label key={key} className={rowClass}>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
                <input type="checkbox" checked={Boolean(form[key])} onChange={(event) => setField(key, event.target.checked)} />
              </label>
            ))}
          </div>
          <div className="flex justify-end"><Button type="submit" icon={Save} loading={saving}>Save settings</Button></div>
        </section>
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-blue-600" /><h2 className="font-bold text-slate-950">Provider status</h2></div>
            <div className="mt-4 space-y-3 text-sm">
              <p>Requested provider: <span className="font-bold">{providerStatus?.requestedProvider || "mock"}</span></p>
              <p>Active provider: <span className="font-bold">{providerStatus?.provider || "mock"}</span></p>
              <p>SMTP configured: <span className="font-bold">{providerStatus?.smtpConfigured ? "Configured" : "Not configured"}</span></p>
              <p>Mode: <span className="font-bold">{providerStatus?.mockMode ? "Mock, no real email" : "SMTP"}</span></p>
              {providerStatus?.warning ? <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 font-semibold text-amber-800">{providerStatus.warning}</p> : null}
            </div>
            <div className="mt-4 flex gap-2"><Button variant="outline" icon={ShieldCheck} onClick={verify}>Verify</Button></div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-950">Send test email</h2>
            <div className="mt-4 space-y-3">
              <Input label="Recipient" type="email" value={testTo} onChange={(event) => setTestTo(event.target.value)} />
              <Button icon={TestTube2} loading={sending} onClick={test}>Send test</Button>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
};

export default EmailSettingsPage;
