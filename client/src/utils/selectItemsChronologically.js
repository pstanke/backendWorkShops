export const selectItemsChronologically = (items) => {
  items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return items;
};
