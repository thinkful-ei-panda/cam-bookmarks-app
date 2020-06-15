/* eslint-disable quotes */
import store from './store.js';
import api from './api.js';


function generateItemRating(item) {
  let html = [];
  for (let i=0; i<item.rating; i++) {
    html.push('<i class=\'fas fa-star\'></i>');
  }
  if (item.rating<5) {
    for (let i=0; i < (5-item.rating); i++) {
      html.push('<i class=\'far fa-star\'></i>');
    }
  }
  return html.join('');
}

function generateItemElement(item) {
  
  return `<li class='flex flex-column js-item-element' id='${item.id}' data-item-id="${item.id}">
            <div class='flex flex-row space-between title'>
              <div class="bookmark-label">${item.title}</div>
              <div class='flex flex-row rating-etc'>
                <span class="star-rating">
                  <div class='rating'>
                    ${generateItemRating(item)}
                  </div>
                </span>
                <form class "expand-collapse">
                  <button id='${item.id}-button' type="button" class="fa fa-plus"></button>
                </form>
              </div>
            </div>

            <div id='${item.id}-description' class='flex flex-column description-div hidden'>
              <div class='flex flex-row'>
                <div class='visit-site-wrapper'>
                  <button class="visit-site" type="button" onclick="${item.url}">Visit Site</button>
                </div>

                <div class='trash-wrapper'>
                  <button type="button" class='far fa-trash-alt js-item-delete'></button>
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

function generateBookmarksString(bookmarks) {
  const items = bookmarks.map((item) => generateItemElement(item));
  return items.join('');
}

function render() {
  console.log('bookmarks.render called!');
  console.log(store.STORE.bookmarks);
  // Filter item list by STORE minRating value
  let bookmarks = [...store.STORE.bookmarks];
  console.log(bookmarks);
  if (store.STORE.minRating) {
    bookmarks = bookmarks.filter(item => item.rating >= store.STORE.minRating);
    console.log(store.STORE);
  }
  // render the shopping list in the DOM
  const bookmarksString = generateBookmarksString(bookmarks);

  // insert that HTML into the DOM
  $('.js-bookmark-list').html(bookmarksString);
  console.log('bookmarks.render ran!');
}

function handleNewBookmarkButton() {
  console.log('bookmarks.handleNewBookmarkButton called!');
  $('#new-bookmark-button').submit(event => {
    event.preventDefault();
    console.log('New bookmark clicked!');
    $('#new-bookmark-section').removeClass('hidden');
    render();
  });
  console.log('bookmarks.handleNewBookmarkButton ran!');
}

function handleNewItemSubmit() {
  $('#new-bookmark-form').submit(event => {
    event.preventDefault();
    console.log('Create button clicked!');
    const newItemName = $('.new-name').val(),
      newItemURL = $('.new-url').val(),
      newItemRating = $('.new-rating').val();
    let newItemDesc = '';
    if ($('#new-description')) {
      newItemDesc = $('#new-description').val();
    }
    if (newItemURL.match(/http/g)) {
      if (!$('.error').hasClass('hidden')){
        $('.error').addClass('hidden');
      }
      api.createBookmark(newItemName,newItemURL,newItemDesc,newItemRating)
        .then((newItem) => {
          store.addItem(newItem);
          $('#new-bookmark-section').addClass('hidden');
          render();
        })
        .catch(err => renderErrorMessage(err.message));
    } else {
      renderErrorMessage('Please include URL protocol (http/https)');
    }
  });
}

function getItemIdFromElement(item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
}

function handleBookmarkExpand() {
  console.log('bookmarks.handleBookmarkClick called!');
  $(`ul`).on('click','.fa-plus', event => {
    event.preventDefault();
    console.log($(event.target).attr('class'));
    console.log($(event.target).closest('li').attr('id'));
    let id = $(event.target).closest('li').attr('id');
    $(`#${id}-description`).removeClass('hidden');
    $(`#${id}-button`).removeClass('fa-plus');
    $(`#${id}-button`).addClass('fa-minus');
    // $(event.target)
    //   .removeClass('.fa-plus')
    //   .addClass('.fa-minus');
  });
}

function handleBookmarkCollapse() {
  console.log('bookmarks.handleBookmarkClick called!');
  $('ul').on('click','.fa-minus', event => {
    event.preventDefault();
    console.log($(event.target).attr('class'));
    let id = $(event.target).closest('li').attr('id');
    $(`#${id}-description`).addClass('hidden');
    $(`#${id}-button`).removeClass('fa-minus');
    $(`#${id}-button`).addClass('fa-plus');
    // $(event.target)
    //   .removeClass('.fa-minus')
    //   .addClass('.fa-plus');
  });
}

function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-bookmark-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        // render the updated shopping list
        render();
      })
      .catch(err => renderErrorMessage(err.message));
  });
}

function handleCancelNewBookmark() {
  $('#cancel-button').click(event => {
    console.log('Cancel button clicked!!')
    event.preventDefault();
    $('#new-bookmark-section').addClass('hidden');
  });
}

// function handleEditShoppingItemSubmit() {
//   $('.js-shopping-list').on('submit', '.js-edit-item', event => {
//     event.preventDefault();
//     const id = getItemIdFromElement(event.currentTarget),
//       itemName = $(event.currentTarget).find('.shopping-item').val();
//     api.updateItem(id,{name: itemName})
//       .then(() => {
//         store.findAndUpdate(id,{name: itemName});
//         render();
//       })
//       .catch(err => renderErrorMessage(err.message));
//   });
// }

// function handleItemCheckClicked() {
//   $('.js-shopping-list').on('click', '.js-item-toggle', event => {
//     const id = getItemIdFromElement(event.currentTarget),
//       foundItem = store.items.find(item => item.id === id);
//     api.updateItem(id, {checked: !foundItem.checked})
//       .then(() => {
//         store.findAndUpdate(id,{checked: !foundItem.checked});
//         render();
//       })
//       .catch(err => renderErrorMessage(err.message));
//   });
// }

function handleFilterChange() {
  console.log('handleFilterChange called!');
  $('.min-rating-selector').change(event => {
    console.log('Selector changed!');
    store.changeFilter($(event.target).val());
    render();
  });
  console.log('handleFilterChange ran!');
}

function bindEventListeners() {
  handleNewBookmarkButton();
  handleNewItemSubmit();
  // handleItemCheckClicked();
  handleDeleteItemClicked();
  handleBookmarkExpand();
  handleBookmarkCollapse();
  // handleEditShoppingItemSubmit();
  handleFilterChange();
  handleCancelNewBookmark();
}

// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};