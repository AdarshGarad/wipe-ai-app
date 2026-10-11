"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function signIn() {
    setBusy(true); setError(""); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
    else router.replace("/dashboard");
  }

  async function signUp() {
    setBusy(true); setError(""); setMsg("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) setError(error.message);
    else if (data.session) router.replace("/dashboard");
    else setMsg("Check your email to confirm your account, then sign in.");
  }

  return (
    <main>
      <h1>Wipe AI</h1>
      <p className="sub">Take your personal data off the internet.</p>
      <div className="card">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <div className="row">
          <button onClick={signIn} disabled={busy || !email || !password}>Sign in</button>
          <button className="ghost" onClick={signUp} disabled={busy || !email || password.length < 8}>Create account</button>
        </div>
        <p className="sub" style={{ marginTop: 10 }}>Passwords need at least 8 characters.</p>
        {error && <p className="err">{error}</p>}
        {msg && <p className="msg">{msg}</p>}
      </div>
    </main>
  );
}
