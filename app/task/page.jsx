// app/task/page.jsx
import { createClient } from '../../utils/supabase/server'
import { handleAddTask, handleDeleteTask } from './actions'

export default async function TaskPage() {
  const supabase = await createClient()
  const {
    data: tasks,
    error
  } = await supabase
    .from('todos')
    .select('id, task')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">Your To-Do List</h1>

        {/* Yeni task əlavə et */}
        <form action={handleAddTask} className="flex space-x-2 mb-6">
          <input
            name="task"
            type="text"
            required
            placeholder="What needs to be done?"
            className="flex-1 border rounded-lg p-2 focus:ring focus:ring-blue-200"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        {/* Task siyahısı */}
        <ul className="space-y-3">
          {tasks.map(({ id, task }) => (
            <li key={id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <span>{task}</span>
              <form action={handleDeleteTask}>
                <input type="hidden" name="id" value={id} />
                <button
                  type="submit"
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete task"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
