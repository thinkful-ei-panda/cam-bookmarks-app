import store from './store';
import api from './api';


function generateItemRating(item) {
  let html = []
  for (let i=0; i<item.rating; i++) {
    html.push('<i class=\'fas fa-star\'></i>');
  }
  if (item.rating<5) {
    for (let i=0; i<item.rating; i++) {
      html.push('<i class=\'far fa-star\'></i>');
    }
  }
  return html.join('');
}

function generateItemElement(item) {
  
  return `<li class='flex flex-column' data-item-id="${item.id}">
            <div class='flex flex-row space-between title'>
              <div class="bookmark-label">Sample Bookmark</div>
              <span class="star-rating">
                <div class='rating'>
                  ${generateItemRating(item)}
                </div>
              </span>
            </div>

            <div class='flex flex-column hidden'>
              <div class='flex flex-row'>
                <div class='visit-site-wrapper'>
                  <button class="visit-site" type="button" onclick="${item.url}">Visit Site</button>
                </div>

                <div class='trash-wrapper'>
                  <button type="button" class='far fa-trash-alt'></button>
                </div>
              </div>
              <p class='description'>${item.desc}</p>
            </div>
          </li>`;
}

function generateErrorMessage(message) {
  return `Something went wrong: ${message}`;
}

function renderErrorMessage(message) {
  const html = generateErrorMessage(message);
  $('.error').html(html)
    .removeClass('hidden');
}

function generateBookmarksString(shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
}

function render() {
  // Filter item list if store prop is true by item.checked === false
  let items = [...store.STORE.bookmarks];

  // render the shopping list in the DOM
  const bookmarksString = generateBookmarksString(items);

  // insert that HTML into the DOM
  $('.js-bookmark-list').html(bookmarksString);
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    api.createItem(newItemName)
      .then((newItem) => {
        store.addItem(newItem);
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
}

function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    api.deleteItem(id)
      .then(() => {
        store.findAndDelete(id);
        // render the updated shopping list
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleEditShoppingItemSubmit() {
  $('.js-shopping-list').on('submit', '.js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget),
      itemName = $(event.currentTarget).find('.shopping-item').val();
    api.updateItem(id,{name: itemName})
      .then(() => {
        store.findAndUpdate(id,{name: itemName});
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget),
      foundItem = store.items.find(item => item.id === id);
    api.updateItem(id, {checked: !foundItem.checked})
      .then(() => {
        store.findAndUpdate(id,{checked: !foundItem.checked});
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleToggleFilterClick() {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
}

function bindEventListeners() {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditShoppingItemSubmit();
  handleToggleFilterClick();
}

// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};