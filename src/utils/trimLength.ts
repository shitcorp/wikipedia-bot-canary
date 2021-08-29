export default (message: string, length: number = 2000) => {
  if (message.length > length) {
    return message.slice(0, length - 3) + '...';
  }

  return message;
};
