import { createSignal, createEffect } from 'solid-js'
import { supabase } from '~/supabaseClient'

const Account = (props) => {
  const [loading, setLoading] = createSignal(true)
  const [username, setUsername] = createSignal(null)
  const [website, setWebsite] = createSignal(null)
  const [avatar_url, setAvatarUrl] = createSignal(null)

  createEffect(() => {
    props.session
    getProfile()
  })

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username: username(),
        website: website(),
        avatar_url: avatar_url(),
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal', // Don't return the value after inserting
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div aria-live="polite">
      {loading() ? (
        'Saving ...'
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <div>Email: {props.session.user.email}</div>
          <div>
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              value={username() || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="url"
              value={website() || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="button block primary" disabled={loading()}>
              Update profile
            </button>
          </div>
        </form>
      )}
      <button type="button" className="button block" onClick={() => supabase.auth.signOut()}>
        Sign Out
      </button>
    </div>
  )
}

export default Account