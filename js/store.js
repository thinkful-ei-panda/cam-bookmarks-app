const DATA = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
  minRating: 0,
};

function findById(id) {
  return this.DATA.bookmarks.find((currentItem) => currentItem.id === id);
}

function addItem(item) {
  const expanded = { expanded: false },
    newItem = Object.assign(item, expanded);
  this.DATA.bookmarks.push(newItem);
}

function findAndUpdate(id, newData) {
  let foundItem = this.findById(id);
  Object.assign(foundItem, newData);
}

function findAndDelete(id) {
  this.DATA.bookmarks = this.DATA.bookmarks.filter(
    (currentItem) => currentItem.id !== id
  );
}

function changeFilter(newMin) {
  this.DATA.minRating = newMin;
}

export default {
  DATA,
  findById,
  addItem,
  findAndDelete,
  findAndUpdate,
  changeFilter,
};
