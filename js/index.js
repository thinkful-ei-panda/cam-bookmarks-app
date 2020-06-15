import api from './api.js';
import store from './store.js';
import bookmarks from './bookmarks.js';

const main = function () {
  // api.createItem('pears')
  //   .then(res => res.json())
  //   .then((newItem) => {
  //     return api.getItems();
  //   })
  //   .then(res => res.json())
  //   .then((items) => {
  //     console.log(items);
  //   });

  api.getBookmarks()
    // .then(res => res.json())
    .then((items) => {
      console.log(items);
      items.forEach((item) => store.addItem(item));
      bookmarks.render();
      // const item = store.items[0];
    });


  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);