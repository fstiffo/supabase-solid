import Counter from "~/components/Counter";
import { createSignal, createEffect } from 'solid-js';
import { supabase } from '~/supabaseClient';
import Auth from "~/components/Auth";
import Account from "~/components/Account"
import "./index.css";

export default function Home() {
  const [session, setSession] = createSignal(null)

  createEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  })

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session() ? <Auth /> : <Account key={session().user.id} session={session()} />}
    </div>
  )
}
