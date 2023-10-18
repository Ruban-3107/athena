import moment from 'moment';

export function mapCoursesToGraphData(
  coursesCompleted: { date: string; total_count: number }[],
  dateRange: string,
  today: Date
) {
  if (dateRange === 'week' || dateRange === 'month') {
    return coursesCompleted.map((course) => {
      const graphLabel =
        moment(course.date).format('YYYY MMM DD') ===
        moment(today).format('YYYY MMM DD')
          ? 'today'
          : moment(course.date).format('MMM DD');
      return {
        graphLabel,
        type: 'courses_data',
        count: course.total_count.toString(),
      };
    });
  } else if (dateRange === 'year') {
    // Group results by month and sum up counts for each month
    const monthlyCounts = coursesCompleted.reduce((acc, course) => {
      const month = moment(course.date).format('MMM');
      if (acc[month]) {
        acc[month] += Number(course.total_count);
      } else {
        acc[month] = Number(course.total_count);
      }
      return acc;
    }, {});

    // Check if any dates are in the current month
    const currentMonth = moment(today).format('MMM');
    let graphLabel = currentMonth;
    if (Object.keys(monthlyCounts).includes(currentMonth)) {
      graphLabel = 'this month';
    }

    // Map results to graph data
    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        graphLabel: month,
        type: 'courses_data',
        count: count.toString(),
      }))
      .concat({
        graphLabel,
        type: 'courses_data',
        count: monthlyCounts[currentMonth]
          ? monthlyCounts[currentMonth].toString()
          : '0',
      });
  } else {
    return [];
  }
}
