const formatDateOrTime = (itemDate) => {
  itemDate = new Date(itemDate); // Convert itemDate to a Date object
  const now = new Date();
  const diff = now - itemDate; // Difference in milliseconds
  const hours = Math.floor(diff / 3600000); // Convert to hours

  if (hours < 24) {
    const minutes = Math.floor((diff % 3600000) / 60000); // Remaining minutes
    return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
  } else {
    return `${itemDate.getDate()} ${itemDate.toLocaleString("en", {
      month: "long",
    })}`;
  }
};
export default formatDateOrTime;
