// app/page.js
import Link from 'next/link'
import { createClient } from '../utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Task-ları da götürək
  let tasks = []
  if (user) {
    const { data, error } = await supabase
      .from('todos')
      .select('task')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    if (error) throw new Error(error.message)
    tasks = data
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>

      {user ? (
        <div className="space-x-6">
          <Link
            href="/userpanel"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Your Panel
          </Link>
          <Link
            href="/task"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create To-Do List
          </Link>

          {/* Mövcud task-ları göstər */}
          {tasks.length > 0 && (
            <div className="mt-6 space-y-1">
              <h2 className="font-semibold">Your Tasks:</h2>
              <ul className="list-disc list-inside">
                {tasks.map(({ task }, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            href="/signin"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-indigo-500 text-white rounded"
          >
            Sign Up
          </Link>
        </div>
      )}
    </main>
  )
}
