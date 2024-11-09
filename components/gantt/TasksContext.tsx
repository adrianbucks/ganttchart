import { createContext, useEffect, useReducer } from 'react'
import { Task } from '@/types/task'

interface TasksState {
  tasks: Task[]
  selectedTask: Task | null
  taskToAction: Task | null
  modalOpen: boolean
  modalMode: 'add' | 'edit' | 'delete'
  taskType: Task['type']
  loading: boolean
  error: string | null
}

type TasksAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SELECT_TASK'; payload: Task }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_TASK_TO_ACTION'; payload: Task }
  | { type: 'SET_MODAL_STATE'; payload: { open: boolean; mode: TasksState['modalMode'] } }
  | { type: 'SET_TASK_TYPE'; payload: Task['type'] }

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  taskToAction: null,
  modalOpen: false,
  modalMode: 'add',
  taskType: 'task',
  loading: false,
  error: null
}

export const TasksContext = createContext<{
	state: TasksState
	selectTask: (task: Task) => void
	addTask: (task: Task, updatedTasks: Task[]) => void
	updateTask: (task: Task, updatedTasks: Task[]) => void
	deleteTask: (taskId: string) => void
	setTaskToAction: (task: Task) => void
	setModalState: (open: boolean, mode: TasksState['modalMode']) => void
	setTaskType: (type: Task['type']) => void
	getChildTasks: (parentId: string) => Task[]
  }>({
	state: initialState,
	selectTask: () => {},
	addTask: () => {},
	updateTask: () => {},
	deleteTask: () => {},
	setTaskToAction: () => {},
	setModalState: () => {},
	setTaskType: () => {},
	getChildTasks: () => []
  })
  

function tasksReducer(state: TasksState, action: TasksAction): TasksState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false }
    case 'SELECT_TASK':
      return { ...state, selectedTask: action.payload }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }
    case 'DELETE_TASK': {
      const getAllChildIds = (taskId: string): string[] => {
        const children = state.tasks.filter(t => t.parentTask === taskId)
        return [taskId, ...children.flatMap(child => getAllChildIds(child.id))]
      }
      const idsToDelete = getAllChildIds(action.payload)
      return {
        ...state,
        tasks: state.tasks.filter((t) => !idsToDelete.includes(t.id)),
      }
    }
    case 'SET_TASK_TO_ACTION':
      return { ...state, taskToAction: action.payload }
    case 'SET_MODAL_STATE':
      return {
        ...state,
        modalOpen: action.payload.open,
        modalMode: action.payload.mode,
      }
    case 'SET_TASK_TYPE':
      return { ...state, taskType: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    default:
      return state
  }
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState)

  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        dispatch({ type: 'SET_TASKS', payload: JSON.parse(storedTasks) })
      }
    } catch (error) {
      console.error(error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks))
  }, [state.tasks])

  const selectTask = (task: Task) => {
    dispatch({ type: 'SELECT_TASK', payload: task })
  }

  const addTask = (task: Task, updatedTasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: updatedTasks })
  }

  const updateTask = (task: Task, updatedTasks: Task[]) => {
    dispatch({ type: 'SET_TASKS', payload: updatedTasks })
  }

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId })
  }

  const setTaskToAction = (task: Task) => {
    dispatch({ type: 'SET_TASK_TO_ACTION', payload: task })
  }

  const setModalState = (open: boolean, mode: TasksState['modalMode']) => {
    dispatch({ type: 'SET_MODAL_STATE', payload: { open, mode } })
  }

  const setTaskType = (type: Task['type']) => {
    dispatch({ type: 'SET_TASK_TYPE', payload: type })
  }

  const getChildTasks = (parentId: string) => {
    return state.tasks.filter((t) => t.parentTask === parentId)
  }

  return (
    <TasksContext.Provider
      value={{
        state,
        selectTask,
        addTask,
        updateTask,
        deleteTask,
        setTaskToAction,
        setModalState,
        setTaskType,
        getChildTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}
