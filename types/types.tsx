export type HistoryProps = {
  tasks: Task[]
  isDarkTheme: boolean
}
export type Location = {
  latitude: number
  longitude: number
}

export type File = {
  uri: string
  name: string
  type: string
}

export type Task = {
  id: string
  title: string
  description: string
  locationDescription: string
  location: Location | null
  synced: boolean
  updated: string
  markerLocation: Location | null
  file: File[]
  deleted: boolean
  deadLine: string
}
export type TaskBlockProps = {
  tasks: Task[]
  deleteTask: (taskId: string) => void
  isDarkTheme: boolean
}
export type TaskCreatorBlockProps = {
  files: FileType[]
  setMarkerLocation: (markerLocation: any) => void
  setFiles: (files: FileType[]) => void
  isDarkTheme: boolean
  taskTitle: string
  setTaskTitle: (taskTitle: string) => void
  taskDescription: string
  setTaskDescription: (taskDescription: string) => void
  locationDescription: string
  setLocationDescription: (locationDescription: string) => void
  setShowMap: (showMap: boolean) => void
  showMap: boolean
  date: Date
  setDate: (date: Date) => void
  addTask: any
  markerLocation: MarkerLocation
}
export type FileType = {
  uri: string
  name: string
  type: string
}
