import React from 'react';
function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}

const formatDate = (date: Date) => {
  const time = date.toLocaleTimeString();
  const formattedDate =
    getMonthName(date.getMonth() + 1) +
    ' ' +
    date.getDate().toString() +
    ', ' +
    date.getFullYear().toString();

  return [formattedDate, time];
};

export default formatDate;
