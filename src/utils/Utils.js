export const parseDateTime = (showDate) => {
    const [date, time] = showDate.includes(',') ? showDate.split(', ') : [showDate, undefined];
    if (!date || !time) {
      console.error("Invalid showDate format:", showDate);
      return [undefined, undefined];
    }
    return [date, time];
  };