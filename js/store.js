const STORE = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0
};

function findById(id) {
  return this.STORE.find(currentItem => currentItem.id === id);
}

function addItem(item) {
  this.STORE.push(item);
}

function findAndUpdate(id,newData) {
  let foundItem = this.findById(id);
  Object.assign(foundItem, newData);
}

function findAndDelete(id) {
  this.STORE = this.STORE.filter(currentItem => currentItem.id !== id);
}

export default {
  STORE,
  findById,
  addItem,
  findAndDelete,
  findAndUpdate
};