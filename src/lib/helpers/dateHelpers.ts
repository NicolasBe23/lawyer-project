export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US");
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US");
};
