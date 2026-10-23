// Helper to generate consistent date strings relative to today
const getTodayTime = (hours, minutes) => {
  const d = new Date();
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

export const INITIAL_PERSONAL_TASKS = [
  {
    id: 'task-1',
    title: 'Morning mindfulness & 20-minute breathwork',
    category: 'Mindfulness & Health',
    priority: 'High',
    stage: 'done',
    completed: true,
    dueDate: 'Today',
    estimatedMinutes: 20,
    startTime: getTodayTime(7, 30),
    endTime: getTodayTime(7, 52), // 22 min SLA
    notes: 'Start the day in calm silence before checking any digital devices.'
  },
  {
    id: 'task-2',
    title: 'Deep focus writing: Draft personal reflections essay',
    category: 'Deep Focus',
    priority: 'High',
    stage: 'done',
    completed: true,
    dueDate: 'Today',
    estimatedMinutes: 90,
    startTime: getTodayTime(8, 45),
    endTime: getTodayTime(10, 10), // 85 min SLA
    notes: 'Focus on chapter 3 ideas and core personal values.'
  },
  {
    id: 'task-3',
    title: 'Prepare wholesome organic lunch & herbal tea',
    category: 'Mindfulness & Health',
    priority: 'Gentle',
    stage: 'done',
    completed: true,
    dueDate: 'Today',
    estimatedMinutes: 35,
    startTime: getTodayTime(12, 10),
    endTime: getTodayTime(12, 42), // 32 min SLA
    notes: 'Fresh greens, roasted seeds, and chamomile.'
  },
  {
    id: 'task-4',
    title: 'Read 30 pages of "The Creative Act" by Rick Rubin',
    category: 'Learning & Growth',
    priority: 'Medium',
    stage: 'doing',
    completed: false,
    dueDate: 'Today, Evening',
    estimatedMinutes: 45,
    startTime: getTodayTime(11, 15),
    endTime: null,
    notes: 'Take notes in paper journal on intuition and perception.'
  },
  {
    id: 'task-5',
    title: 'Review weekly household finances & mindful budget',
    category: 'Life & Admin',
    priority: 'Medium',
    stage: 'review',
    completed: false,
    dueDate: 'Tomorrow',
    estimatedMinutes: 30,
    startTime: getTodayTime(10, 20),
    endTime: null,
    notes: 'Ensure savings goal is on track and cancel unused subscription.'
  },
  {
    id: 'task-6',
    title: 'Sunset nature walk & digital disconnect',
    category: 'Mindfulness & Health',
    priority: 'Gentle',
    stage: 'backlog',
    completed: false,
    dueDate: 'Today, 6:00 PM',
    estimatedMinutes: 40,
    startTime: null,
    endTime: null,
    notes: 'Leave phone at home; observe the evening sky and fresh breeze.'
  },
  {
    id: 'task-7',
    title: 'Design personal studio corner & declutter workspace',
    category: 'Deep Focus',
    priority: 'Gentle',
    stage: 'backlog',
    completed: false,
    dueDate: 'Saturday',
    estimatedMinutes: 60,
    startTime: null,
    endTime: null,
    notes: 'Clean desk surface, arrange warm lighting and plants.'
  }
];

export const INITIAL_WEEKLY_STATS = [
  { day: 'Mon', completed: 6, pending: 2, focusMinutes: 180 },
  { day: 'Tue', completed: 8, pending: 1, focusMinutes: 240 },
  { day: 'Wed', completed: 5, pending: 3, focusMinutes: 160 },
  { day: 'Thu', completed: 9, pending: 2, focusMinutes: 270 },
  { day: 'Fri', completed: 7, pending: 1, focusMinutes: 210 },
  { day: 'Sat', completed: 4, pending: 2, focusMinutes: 120 },
  { day: 'Sun', completed: 6, pending: 1, focusMinutes: 150 },
];
