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
  { value: "SAT", label: "السبت" },
  { value: "SUN", label: "الاحد" },
  { value: "MON", label: "الاثنين" },
  { value: "TUE", label: "الثلاثا" },
  { value: "WED", label: "الاربعا" },
  { value: "THU", label: "الخميس" },
  { value: "FRI", label: "الجمعة" },
]

export const HALL_TYPES = [
  { value: "قاعة", label: "قاعة", color: "bg-green-300 text-green-800" },
  { value: "معمل", label: "معمل", color: "bg-blue-300 text-blue-800" },
  { value: "مدرج", label: "مدرج", color: "bg-amber-300 text-amber-800" },
  { value: "مرسم", label: "مرسم", color: "bg-purple-300 text-purple-800" },
]

export const INSTRUCTOR_TYPES = [
  { value: "دكتور", label: "دكتور" },
  { value: "مهندس", label: "مهندس" },
  { value: "استاذ", label: "استاذ" },
]

export const SUBJECT_TYPES = [
  { value: "نظري", label: "نظرى" },
  { value: "تمارين", label: "تمارين" },
  { value: "عملي", label: "عملى" },
]
