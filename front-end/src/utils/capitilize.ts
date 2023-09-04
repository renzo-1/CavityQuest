export const capitalize = (input?: string) => {
    if (input) {
      const upperFirstLetter = input.charAt(0).toUpperCase();
      return upperFirstLetter + [...input].slice(1).join('');
    }
    return undefined;
  };