export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Task {
  id: string
  title: string
  description: string
  columnId: string
  createdAt: string
  order: number
  assignedTo?: string
}

export interface Column {
  id: string
  title: string
  order: number
}

export interface DragItem {
  id: string
  type: string
  columnId: string
  index: number
}
