'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchAllTasks, enviarFormulario, closeTask, uncloseTask, handleEditTask, handleSaveTask, handleDeleteTask, getSortedTasks, getFilteredTasks } from "@/utils/saveTaskUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  created_at: string;
  status: string;
  closed_at: string | null;
}

export default function Home() {
  const [tarefa, setTarefa] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortCriteria, setSortCriteria] = useState('date-desc');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState('');
  const filteredTasks = getFilteredTasks(tasks, filter)
  const sortedAndFilteredTasks = getSortedTasks(filteredTasks, sortCriteria)

  useEffect(() => {
    fetchAllTasks(setTasks);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <main className="py-20"> 
        <h1 className="mt-8 mb-8 text-center text-3xl font-semibold">TodoApp</h1>
        <div className="flex gap-2 items-center justify-center">
          <form className="flex gap-2 w-full" id="tarefa" onSubmit={(e) => {
            e.preventDefault();
            console.log('onSubmit tarefa:', tarefa.trim());
            if (tarefa.trim() !== '') {
              enviarFormulario(tarefa, setTarefa, tasks, setTasks);
            } else {
              toast.error('O texto da tarefa não pode ser vazio.');
            }
          }}>
            <Input className='!w-full !bg-gray-800' value={tarefa} onChange={(e) => setTarefa(e.target.value)} />
            <Button type="submit" disabled={!tarefa.trim()}> Adicionar Tarefa </Button>
          </form>
        </div>
        <div className="flex mt-6 gap-4 justify-between">
          <div className='flex gap-2'>
            <Button className={`bg-gray-700 text-white ${filter === 'Ativa' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-700' : ''}`} onClick={() => setFilter('Ativa')}>
              Ativas
            </Button>
            <Button className={`bg-gray-700 text-white ${filter === 'Concluida' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-700 hover:text-gray-900' : ''}`} onClick={() => setFilter('Concluida')}>
              Concluídas
            </Button>
            <Button className={`bg-gray-700 text-white ${filter === 'all' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-700' : ''}`} onClick={() => setFilter('all')}>
              Todas
            </Button>
          </div>
          <Select onValueChange={setSortCriteria} defaultValue={sortCriteria}>
            <SelectTrigger className="w-[180px] !bg-gray-800 text-white">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="date-desc">Data (Mais Recente)</SelectItem>
              <SelectItem value="date-asc">Data (Mais Antiga)</SelectItem>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="scrollbarcss mt-8 px-4 max-h-[500px] overflow-y-auto bg-gray-800 pt-4 pb-4 rounded-tl-3xl rounded-bl-3xl rounded-tr-sm rounded-br-sm min-w-[840px]">
          <ul className="flex flex-col gap-2">
            {sortedAndFilteredTasks.map((task) => (
              <li key={task.id} className={`${status === 'Concluida' ? 'bg-red-800':''} w-[800] flex items-center gap-4 py-2 px-5 rounded-xl text-white bg-gray-700`}>
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.status === 'Concluida'}
                  onCheckedChange={() => {
                    if (task.status === 'Ativa') {
                      closeTask(task.id, tasks, setTasks);
                    } else {
                      uncloseTask(task.id, tasks, setTasks);
                    }
                  }}
                />
                <div className="flex flex-col flex-grow">
                  {editingTaskId === task.id ? (
                    <Input
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                      onBlur={() => handleSaveTask(task.id, editingTaskText, setEditingTaskId, setEditingTaskText, tasks, setTasks)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveTask(task.id, editingTaskText, setEditingTaskId, setEditingTaskText, tasks, setTasks);
                        }
                      }}
                      className="text-white !text-base py-2 pt-0 pb-0 !h-6 pl-0 bg-gray-200 border-none border-white outline-none !ring-0"
                    />
                  ) : (
                    task.text
                  )}
                  <div className="text-xs text-gray-400 font-semibold">
                    {new Date(task.created_at).toLocaleDateString("br", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingTaskId !== task.id && (
                    <div className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center">
                      <Edit size={18} className="text-white cursor-pointer h-4 w-4 hover:text-gray-200" onClick={() => handleEditTask(task, setEditingTaskId, setEditingTaskText)} />
                    </div>
                  )}
                    <div className="bg-gray-800 rounded-sm h-7 w-7 flex items-center justify-center">
                      <Trash2 size={18} className="text-white cursor-pointer hover:text-gray-200" onClick={() => handleDeleteTask(task.id, tasks, setTasks)} />
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Toaster />
      </main>
      <footer>
      </footer>
    </div>
  );
}
