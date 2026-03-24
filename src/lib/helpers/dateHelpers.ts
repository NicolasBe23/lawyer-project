export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateLong = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isDatePast = (dateString: string) => {
  const scheduleDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  scheduleDate.setHours(0, 0, 0, 0);
  return scheduleDate < today;
};

export const isDateToday = (dateString: string) => {
  const scheduleDate = new Date(dateString);
  const today = new Date();
  return scheduleDate.toDateString() === today.toDateString();
};
