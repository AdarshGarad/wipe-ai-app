"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const LABEL = {
  queued: "Queued",
  in_progress: "Working on it",
  submitted: "Submitted",
  awaiting_verification: "Check your email",
  removed: "Removed",
  failed: "Failed",
  needs_user: "Needs you",
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(undefined);
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (u) => {
    const { data: p } = await supabase.from("profiles").select("*").eq("user_id", u.id).maybeSingle();
    setProfile(p || null);
    const { data: t } = await supabase
      .from("removal_tasks")
      .select("id,status,last_error,brokers(name,optout_url)")
      .order("id");
    setTasks(t || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace("/"); return; }
      setUser(data.session.user);
      load(data.session.user);
    });
  }, [router, load]);

  async function start() {
    if (!name.trim()) { setError("Please enter your name."); return; }
    setBusy(true); setError("");
    const { error: e1 } = await supabase
      .from("profiles")
      .upsert({ user_id: user.id, full_name: name.trim(), country: country.trim() || null });
    if (e1) { setError(e1.message); setBusy(false); return; }
    const { error: e2 } = await supabase.from("scans").insert({ user_id: user.id });
    if (e2) setError(e2.message);
    await load(user);
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  if (!user || profile === undefined) return <main><p className="sub">Loading...</p></main>;

  const done = tasks.filter((t) => t.status === "removed").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <main>
      <div className="row">
        <h1>Wipe AI</h1>
        <button className="ghost" onClick={signOut}>Sign out</button>
      </div>

      {!profile ? (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>Start your scan</h2>
          <p className="sub">We only ask for what we need to find your listings.</p>
          <label htmlFor="n">Full name</label>
          <input id="n" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <label htmlFor="c">Country</label>
          <input id="c" value={country} onChange={(e) => setCountry(e.target.value)} />
          <button onClick={start} disabled={busy}>Start scan</button>
          {error && <p className="err">{error}</p>}
        </div>
      ) : (
        <>
          <div className="card">
            <p className="sub" style={{ margin: 0 }}>Cleanup progress</p>
            <h2 style={{ margin: "4px 0 0" }}>{pct}% done ({done} of {tasks.length})</h2>
          </div>
          <h2>Where you appear</h2>
          {tasks.length === 0 && (
            <div className="card"><p className="sub" style={{ margin: 0 }}>Your scan is requested. Results will show up here.</p></div>
          )}
          {tasks.map((t) => (
            <div className="card" key={t.id}>
              <div className="row">
                <strong>{t.brokers?.name}</strong>
                <span className={"pill " + (t.status === "removed" ? "ok" : t.status === "needs_user" || t.status === "awaiting_verification" ? "warn" : "")}>
                  {LABEL[t.status] || t.status}
                </span>
              </div>
              {t.status === "needs_user" && t.brokers?.optout_url && (
                <p className="sub" style={{ margin: "8px 0 0" }}>
                  <a href={t.brokers.optout_url} target="_blank" rel="noopener noreferrer">Do this one yourself</a>
                </p>
              )}
            </div>
          ))}
          {error && <p className="err">{error}</p>}
        </>
      )}
    </main>
  );
}
