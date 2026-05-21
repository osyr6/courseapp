"use client"
import { useSession } from "next-auth/react"

export default function DebugPage() {
  const { data: session } = useSession()
  return (
    <div className="p-10">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}