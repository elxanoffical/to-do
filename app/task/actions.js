// app/task/actions.js
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'

export async function handleAddTask(formData) {
  const supabase = await createClient()

  // 1) İstifadəçini al
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  // 2) formdan task mətnini götür
  const task = formData.get('task')

  // 3) insert edərkən user_id-i də ver
  const { error } = await supabase
    .from('todos')
    .insert({
      task,
      user_id: user.id
    })

  if (error) throw new Error(error.message)

  redirect('/task')
}

export async function handleDeleteTask(formData) {
  const supabase = await createClient()

  // Eyni qayda ilə silməzdən öncə yoxlaya bilərsən ki, real user silsin
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()
  if (userError || !user) {
    throw new Error('User not authenticated')
  }

  const id = formData.get('id')
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)    // bura da əlavə et ki, yalnız öz tapşırığını silə biləsən

  if (error) throw new Error(error.message)

  redirect('/task')
}
