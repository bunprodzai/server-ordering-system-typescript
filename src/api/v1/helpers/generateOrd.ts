
export const generateOrd = () => {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1); // tháng bắt đầu từ 0
  const year = now.getFullYear();

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const orderCode = `ORD${hours}${minutes}${seconds}${day}${month}${year}`;
  return orderCode;
};