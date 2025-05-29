import { createSupabaseClient } from '@/utils/supabaseclient'
import { toast } from 'sonner'
import { useTaskContext } from '@/contexts/TaskContext'

export const useTaskActions = () => {
  const {
    tasks,
    setTasks,
    setTarefa,
    setEditingTaskId,
    setEditingTaskText,
    setEditingTaskDate
  } = useTaskContext()

  const fetchAllTasks = async () => {
    const { data, error } = await createSupabaseClient
      .from('tarefas')
      .select('*, tags')
    if (error) {
      console.error('Erro ao buscar tarefas:', error)
    } else {
      setTasks(data)
    }
  }

  const enviarFormulario = async (tarefa: string, createdAt: Date, tags: string) => {
    if (tarefa.trim() === '') return

    const { data, error } = await createSupabaseClient
      .from('tarefas')
      .insert({
        text: tarefa.trim(),
        date_task: createdAt.toISOString(),
        tags: tags.trim(),
      })
      .select()

    if (error) {
      console.error('Erro ao adicionar tarefa:', error)
    } else {
      setTarefa('')
      toast.success('Tarefa adicionada com sucesso!')
      setTasks([...tasks, ...data])
    }
  }

  const closeTask = async (id: string) => {
    const now = new Date().toISOString()
    const { error } = await createSupabaseClient
      .from('tarefas')
      .update({ status: 'Concluida', closed_at: now })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao concluir tarefa.')
    } else {
      toast.success('Tarefa concluída!')
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, status: 'Concluida', closed_at: now } : t
      ))
    }
  }

  const uncloseTask = async (id: string) => {
    const { error } = await createSupabaseClient
      .from('tarefas')
      .update({ status: 'Ativa', closed_at: null })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao reabrir tarefa.')
    } else {
      toast.success('Tarefa reaberta!')
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, status: 'Ativa', closed_at: null } : t
      ))
    }
  }

  const handleEditTask = (id: string, text: string) => {
    setEditingTaskId(id)
    setEditingTaskText(text)

    const tarefa = tasks.find(t => t.id === id)
    if (tarefa) {
      setEditingTaskDate(tarefa.date_task)
    }
  }

  const handleSaveTask = async (id: string, newText: string) => {
    if (newText.trim() === '') {
      toast.error('O texto da tarefa não pode ser vazio.')
      setEditingTaskId(null)
      setEditingTaskText('')
      return
    }

    const { error } = await createSupabaseClient
      .from('tarefas')
      .update({ text: newText })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar tarefa.')
    } else {
      toast.success('Tarefa atualizada!')
      setEditingTaskId(null)
      setEditingTaskText('')
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, text: newText } : t
      ))
    }
  }

  const handleSaveTaskDate = async (id: string, newDate: string) => {
    const { error } = await createSupabaseClient
      .from('tarefas')
      .update({ date_task: newDate })
      .eq('id', id)

    if (error) {
      toast.error('Erro ao atualizar data da tarefa.')
    } else {
      toast.success('Data da tarefa atualizada!')
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, date_task: newDate } : t
      ))
    }
  }

  const handleDeleteTask = async (id: string) => {
    const { error } = await createSupabaseClient
      .from('tarefas')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Erro ao excluir tarefa.')
    } else {
      toast.success('Tarefa excluída!')
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  return {
    fetchAllTasks,
    enviarFormulario,
    closeTask,
    uncloseTask,
    handleEditTask,
    handleSaveTask,
    handleSaveTaskDate,
    handleDeleteTask
  }
}
