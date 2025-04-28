import { createSupabaseClient } from "@/utils/supabaseclient";
import { toast } from "sonner";

interface Task {
  id: string;
  text: string;
  created_at: string;
  status: string;
  closed_at: string | null;
}

export const fetchAllTasks = async (setTasks: (tasks: Task[]) => void) => {
  const { data, error } = await createSupabaseClient
    .from('tarefas')
    .select('*');
  if (error) {
    console.error('Erro ao buscar tarefas:', error);
  } else {
    setTasks(data);
  }
};

export const enviarFormulario = async (tarefa: string, setTarefa: (tarefa: string) => void, tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  console.log('enviarFormulario tarefa:', tarefa.trim());

  if (tarefa.trim() === '') {
    return;
  }

  const { data, error } = await createSupabaseClient
    .from('tarefas')
    .insert({ text: tarefa.trim()})
    .select();

  if (error) {
    console.error('Erro ao adicionar tarefa:', error);
  } else {
    setTarefa('');
    toast.success("Tarefa adicionada com sucesso!");
    setTasks([...tasks, ...data]);
  }
}

export const closeTask = async (id: string, tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  const currentDate = new Date().toISOString();
  const { error } = await createSupabaseClient
    .from('tarefas')
    .update({ status: 'Concluida', closed_at: currentDate })
    .eq('id', id);

  if (error) {
    console.error('Erro ao concluir tarefa:', error);
    toast.error('Erro ao concluir tarefa.');
  } else {
    toast.success('Tarefa concluída!');
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'Concluida', closed_at: currentDate } : task
    ));
  }
};

export const uncloseTask = async (id: string, tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  const { error } = await createSupabaseClient
    .from('tarefas')
    .update({ status: 'Ativa', closed_at: null })
    .eq('id', id);

  if (error) {
    console.error('Erro ao reabrir tarefa:', error);
    toast.error('Erro ao reabrir tarefa.');
  } else {
    toast.success('Tarefa reaberta!');
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'Ativa', closed_at: null } : task
    ));
  }
};

export const handleEditTask = (task: Task, setEditingTaskId: (id: string | null) => void, setEditingTaskText: (text: string) => void) => {
  setEditingTaskId(task.id);
  setEditingTaskText(task.text);
};

export const handleSaveTask = async (id: string, newText: string, setEditingTaskId: (id: string | null) => void, setEditingTaskText: (text: string) => void, tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  if (newText.trim() === '') {
    toast.error('O texto da tarefa não pode ser vazio.');
    setEditingTaskId(null);
    setEditingTaskText('');
    return;
  }

  const { error } = await createSupabaseClient
    .from('tarefas')
    .update({ text: newText })
    .eq('id', id);

  if (error) {
    console.error('Erro ao atualizar tarefa:', error);
    toast.error('Erro ao atualizar tarefa.');
  } else {
    toast.success('Tarefa atualizada!');
    setEditingTaskId(null);
    setEditingTaskText('');
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  }
};

export const handleDeleteTask = async (id: string, tasks: Task[], setTasks: (tasks: Task[]) => void) => {
  const { error } = await createSupabaseClient
    .from('tarefas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao excluir tarefa:', error);
    toast.error('Erro ao excluir tarefa.');
  } else {
    toast.success('Tarefa excluída!');
    setTasks(tasks.filter(task => task.id !== id));
  }
};

export const getSortedTasks = (tasks: Task[], criteria: string): Task[] => {
  const sortedTasks = [...tasks];

  switch (criteria) {
    case 'date-asc':
      sortedTasks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case 'date-desc':
      sortedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'name-asc':
      sortedTasks.sort((a, b) => a.text.localeCompare(b.text));
      break;
    case 'name-desc':
      sortedTasks.sort((a, b) => b.text.localeCompare(a.text));
      break;
    default:
      sortedTasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }
  return sortedTasks;
};

export const getFilteredTasks = (tasks: Task[], filter: string): Task[] => {
  if (filter === 'all') {
    return tasks;
  } else {
    const lowerCaseFilter = filter.toLowerCase();
    return tasks.filter(task => {
      const lowerCaseStatus = task.status.toLowerCase();
      return lowerCaseStatus === lowerCaseFilter ||
        (lowerCaseFilter === 'concluida' && lowerCaseStatus === 'concluidas');
    });
  }
};
