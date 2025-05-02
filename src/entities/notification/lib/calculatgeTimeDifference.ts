export const calculateTimeDifference = (date1: Date) => {
    const now = new Date();
    const differenceInMilliseconds = now.getTime() - date1.getTime();
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  
    if (differenceInSeconds < 60) {
      return `${differenceInSeconds}초 전`;
    }
  
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    if (differenceInMinutes < 60) {
      return `${differenceInMinutes}분 전`;
    }
  
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    if (differenceInHours < 24) {
      return `${differenceInHours}시간 전`;
    }
  
    const differenceInDays = Math.floor(differenceInHours / 24);
    if (differenceInDays == 1) {
      return "어제";
    }
    if (differenceInDays < 7) {
      return `${differenceInDays}일 전`;
    }
    const differenceInWeeks = Math.floor(differenceInDays / 7);
    return `${differenceInWeeks}주 전`;
  };