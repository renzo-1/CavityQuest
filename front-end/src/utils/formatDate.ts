import React from 'react';
function getMonthName(monthNumber: number) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'long' });
}

const formatDate = (date: string | Date) => {
  const dateObj = new Date(date);
  const formatedDate =
    getMonthName(dateObj.getMonth()) +
    ' ' +
    dateObj.getDate().toString() +
    ', ' +
    dateObj.getFullYear().toString();
  return formatedDate;
};

export default formatDate;
