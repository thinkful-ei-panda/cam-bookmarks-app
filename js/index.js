import api from './api';
import store from './store';
import bookmarks from './shopping-list';

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
  
  api.getItems()
    // .then(res => res.json())
    .then((items) => {
      items.forEach((item) => store.addItem(item));
      bookmarks.render();
      // const item = store.items[0];
    });


  bookmarks.bindEventListeners();
  bookmarks.render();
};

$(main);