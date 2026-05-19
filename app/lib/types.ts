export interface Department {
  id: string
  title: string
  abbreviation: string
  num_levels: number
  created_at: string
  updated_at: string
}

export interface Level {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Building {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Hall {
  id: string
  title: string
  building_id: string
  floor: number
  type: "lecture" | "lab" | "seminar"
  created_at: string
  updated_at: string
  building?: Building
}

export interface Instructor {
  id: string
  name: string
  type: "professor" | "assistant" | "teaching_assistant"
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  title: string
  english_title: string | null
  type: "lecture" | "practical" | "lab"
  parent_id: string | null
  created_at: string
  updated_at: string
  parent?: Subject
}

export interface Batch {
  id: string
  department_id: string
  level_id: string
  department_abbr: string
  created_at: string
  updated_at: string
  department?: Department
  level?: Level
}

export interface Lecture {
  id: string
  day_of_week: number
  start_at: string
  end_at: string
  subject_id: string
  hall_id: string
  instructor_id: string
  batch_id: string
  canceled: boolean
  group: string | null
  created_at: string
  updated_at: string
  subject?: Subject
  hall?: Hall
  instructor?: Instructor
  batch?: Batch
}

export const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export const HALL_TYPES = [
  { value: "lecture", label: "Lecture Hall" },
  { value: "lab", label: "Laboratory" },
  { value: "seminar", label: "Seminar Room" },
]

export const INSTRUCTOR_TYPES = [
  { value: "professor", label: "Professor" },
  { value: "assistant", label: "Assistant" },
  { value: "teaching_assistant", label: "Teaching Assistant" },
]

export const SUBJECT_TYPES = [
  { value: "lecture", label: "Lecture" },
  { value: "practical", label: "Practical" },
  { value: "lab", label: "Lab" },
]
