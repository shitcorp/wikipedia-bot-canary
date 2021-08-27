export default (message: string, length: number) => {
  if (message.length > length) {
    return message.slice(0, length - 3) + '...';
  }

  return message;
};
