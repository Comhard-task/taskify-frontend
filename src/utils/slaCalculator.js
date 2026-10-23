/**
 * SLA (Service Level Agreement / Completion Turnaround) Calculator
 * Computes average duration between startTime and endTime of completed tasks.
 */

export function calculateTaskSLA(tasks = []) {
  const completedTasks = tasks.filter((t) => (t.completed || t.stage === 'done') && t.startTime && t.endTime);

  if (completedTasks.length === 0) {
    return {
      avgMinutes: 0,
      formattedAvgSLA: '0 min',
      slaComplianceRate: 100,
      totalCompletedWithSLA: 0,
      fastestTask: null,
      categorySLA: []
    };
  }

  let totalDurationMinutes = 0;
  let withinSlaCount = 0;
  let fastest = null;
  const categoryMap = {};

  completedTasks.forEach((task) => {
    const start = new Date(task.startTime).getTime();
    const end = new Date(task.endTime).getTime();
    const durationMs = Math.max(0, end - start);
    const durationMin = Math.max(1, Math.round(durationMs / (1000 * 60)));

    totalDurationMinutes += durationMin;

    // Check if within estimated target SLA (with 15% grace tolerance)
    const targetMin = (task.estimatedMinutes || 45) * 1.15;
    if (durationMin <= targetMin) {
      withinSlaCount++;
    }

    if (!fastest || durationMin < fastest.durationMin) {
      fastest = {
        title: task.title,
        durationMin,
        category: task.category
      };
    }

    // Category tracking
    if (!categoryMap[task.category]) {
      categoryMap[task.category] = { totalMin: 0, count: 0 };
    }
    categoryMap[task.category].totalMin += durationMin;
    categoryMap[task.category].count += 1;
  });

  const avgMinutes = Math.round(totalDurationMinutes / completedTasks.length);
  const slaComplianceRate = Math.round((withinSlaCount / completedTasks.length) * 100);

  const formattedAvgSLA =
    avgMinutes >= 60
      ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`
      : `${avgMinutes} min`;

  const categorySLA = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    avgMin: Math.round(data.totalMin / data.count),
    completedCount: data.count
  }));

  return {
    avgMinutes,
    formattedAvgSLA,
    slaComplianceRate,
    totalCompletedWithSLA: completedTasks.length,
    fastestTask: fastest,
    categorySLA
  };
}

/**
 * Calculate SLA details for an individual completed task
 */
export function getSingleTaskSLA(task) {
  if (!task.startTime || !task.endTime) {
    return null;
  }

  const start = new Date(task.startTime);
  const end = new Date(task.endTime);
  const durationMs = Math.max(0, end.getTime() - start.getTime());
  const durationMin = Math.max(1, Math.round(durationMs / (1000 * 60)));

  const targetMin = task.estimatedMinutes || 30;
  const isCompliant = durationMin <= targetMin * 1.15;

  const formatTime = (d) => {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    durationMin,
    formattedDuration: durationMin >= 60 ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m` : `${durationMin} min`,
    targetMin,
    isCompliant,
    formattedStart: formatTime(start),
    formattedEnd: formatTime(end)
  };
}
