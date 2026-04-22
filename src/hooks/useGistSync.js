import { useState, useCallback, useRef } from 'react'

const GIST_ID = '496dacecbdb3ab2f96db4774ae86db0a'
const GIST_FILE = 'data.json'
const PAT_KEY = 'gist-pat'

export function useGistSync() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [syncError, setSyncError] = useState(null)
  const debounceRef = useRef(null)

  const getPat = () => localStorage.getItem(PAT_KEY)
  const savePat = (pat) => localStorage.setItem(PAT_KEY, pat)
  const clearPat = () => localStorage.removeItem(PAT_KEY)
  const hasPat = () => !!getPat()

  const fetchFromGist = useCallback(async () => {
    const pat = getPat()
    if (!pat) return null
    setSyncing(true)
    setSyncError(null)
    try {
      const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: { Authorization: `token ${pat}`, Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      const data = await res.json()
      const content = data.files?.[GIST_FILE]?.content
      setLastSync(new Date())
      return content ? JSON.parse(content) : []
    } catch (e) {
      setSyncError(e.message)
      return null
    } finally {
      setSyncing(false)
    }
  }, [])

  const pushToGist = useCallback((cartons) => {
    const pat = getPat()
    if (!pat) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSyncing(true)
      setSyncError(null)
      try {
        const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
          method: 'PATCH',
          headers: {
            Authorization: `token ${pat}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ files: { [GIST_FILE]: { content: JSON.stringify(cartons, null, 2) } } }),
        })
        if (!res.ok) throw new Error(`GitHub API ${res.status}`)
        setLastSync(new Date())
      } catch (e) {
        setSyncError(e.message)
      } finally {
        setSyncing(false)
      }
    }, 1500)
  }, [])

  return { fetchFromGist, pushToGist, savePat, clearPat, hasPat, syncing, lastSync, syncError }
}
