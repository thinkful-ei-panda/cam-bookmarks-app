/* eslint-disable indent */
/* eslint-disable quotes */
import store from './store.js';
import api from './api.js';

function generateItemRating(item) {
  let html = [];
  for (let i = 0; i < item.rating; i++) {
    html.push("<i class='fas fa-star'></i>");
  }
  if (item.rating < 5) {
    for (let i = 0; i < 5 - item.rating; i++) {
      html.push("<i class='far fa-star'></i>");
    }
  }
  return html.join('');
}

function generateItemElement(item) {
  return `<li class='flex flex-column js-item-element' id='${
    item.id
  }' data-item-id="${item.id}">
            <div class='flex flex-row space-between title' id='${
              item.id
            }-title'>
              <div class="bookmark-label">${item.title}</div>
              <div class='flex flex-row rating-etc'>
                <span class="star-rating">
                  <div class='rating'>
                    ${generateItemRating(item)}
                  </div>
                </span>
                <form class "expand-collapse">
                  <button id='${
                    item.id
                  }-button' type="button" class="fa fa-plus"></button>
                </form>
              </div>
            </div>`;
}

function generateExpandedItemElement(item) {
  return `<li class='flex flex-column js-item-element' id='${
    item.id
  }' data-item-id="${item.id}">
            <div class='flex flex-row space-between expanded-header title' id='${
              item.id
            }-title'>
              <div class="bookmark-label">${item.title}</div>
              <div class='flex flex-row rating-etc'>
                <span class="star-rating">
                  <div class='rating'>
                    ${generateItemRating(item)}
                  </div>
                </span>
                <form class "expand-collapse">
                  <button id='${
                    item.id
                  }-button' type="button" class="fa fa-minus"></button>
                </form>
              </div>
            </div>

            <div id='${
              item.id
            }-description' class='flex flex-column description-div'>
              <div class='flex flex-row'>
                <div class='visit-site-wrapper'>
                  <button class="visit-site" type="button" onclick="${
                    item.url
                  }">Visit Site</button>
                </div>

                <div class='trash-wrapper'>
                  <button type="button" class='far fa-trash-alt js-item-delete'></button>
                </div>
              </div>
              <p class='description'>${item.desc}</p>
            </div>
          </li>`;
}

function generateNewBookmarkForm() {
  return `<section id="new-bookmark-section" class="">
  <div class="flex flex-column">
    <form id="new-bookmark-form" aria-label="New Bookmark Form">
      <fieldset>
        <div class="flex flex-row space-between label-rating">
          <div>
            <label for="new-url">Add New Bookmark:</label>
          </div>
          <div>
            <select
              class="new-rating"
              name="new-rating"
              aria-label="Select a rating"
              required
            >
              <option value="">Select a rating</option>
              <option value="5">★★★★★</option>
              <option value="4">★★★★</option>
              <option value="3">★★★</option>
              <option value="2">★★</option>
              <option value="1">★</option>
            </select>
          </div>
        </div>
        <input
          type="text"
          class="new-url"
          name="new-url"
          placeholder="www.example.com"
          aria-label="Website URL"
          required
        />

        <input
          type="text"
          class="new-name"
          name="new-name"
          placeholder="Website Name"
          aria-label="Website Name"
          required
        />

        <div class="flex flex-column description-box">
          <textarea
            id="new-description"
            name="description"
            placeholder="Add a description (optional)"
            aira-label="Website Description"
          ></textarea>
        </div>

        <div>
          <button type="reset" id="cancel-button">Cancel</button>
          <button type="submit">Create</button>
        </div>
      </fieldset>
    </form>
  </div>
</section>`;
}

function generateTopButtons() {
  return `
  <section class="flex flex-row" id="top-buttons">
    <form id="new-bookmark-button">
      <button
        type="submit"
        class="new-bookmark-button"
        aria-label="New Bookmark"
      >
        New <i class="far fa-bookmark"></i>
      </button>
    </form>
    <form id="rating-selector-form">
      <select
        class="min-rating-selector"
        name="min-rating-selector"
        aria-label="Minimum Rating"
      >
        <option value="">Minimum Rating</option>
        <option value="5">★★★★★</option>
        <option value="4">★★★★</option>
        <option value="3">★★★</option>
        <option value="2">★★</option>
        <option value="1">★</option>
      </select>
    </form>
  </section>`;
}

function generateErrorMessage(message) {
  return `<p class="error">Something went wrong: ${message}</p>`;
}

function renderErrorMessage(message) {
  const html = generateErrorMessage(message);
  $('.error').html(html).removeClass('hidden');
}

function generateBookmarksString(bookmarks) {
  const items = bookmarks.map((item) =>
    item.expanded === true
      ? generateExpandedItemElement(item)
      : generateItemElement(item)
  );
  return `<section>
    <ul class="bookmark-list js-bookmark-list">${items.join('')}</section>`;
}
function render() {
  // Filter item list by STORE minRating value
  let bookmarks = [...store.DATA.bookmarks],
    html = '';
  if (store.DATA.minRating) {
    bookmarks = bookmarks.filter((item) => item.rating >= store.DATA.minRating);
  }

  const bookmarksString = generateBookmarksString(bookmarks),
    topButtonsString = generateTopButtons();

  if (store.DATA.adding) {
    const newFormString = generateNewBookmarkForm();
    html = `${topButtonsString}${newFormString}${bookmarksString}`;
  } else {
    html = `${topButtonsString}${bookmarksString}`;
  }

  if (store.DATA.error) {
    let error = generateErrorMessage(store.DATA.error);
    html = `${error}${html}`;
  }

  // insert that HTML into the DOM
  $('main').html(html);
}

function handleNewBookmarkButton() {
  $('main').on('submit', '#new-bookmark-button', (event) => {
    event.preventDefault();
    store.DATA.adding = true;
    render();
  });
}

function handleNewItemSubmit() {
  $('main').on('submit', '#new-bookmark-form', (event) => {
    event.preventDefault();
    const newItemName = $('.new-name').val(),
      newItemURL = $('.new-url').val(),
      newItemRating = $('.new-rating').val();
    let newItemDesc = '';
    if ($('#new-description')) {
      newItemDesc = $('#new-description').val();
    }
    if (newItemURL.match(/http/g)) {
      store.DATA.error = null;
      api
        .createBookmark(newItemName, newItemURL, newItemDesc, newItemRating)
        .then((newItem) => {
          store.addItem(newItem);
          render();
        })
        .catch((err) => (store.DATA.error = err.message));
    } else {
      store.DATA.error = 'Please include URL protocol (http/https)';
      render();
    }
  });
}

function getItemIdFromElement(item) {
  return $(item).closest('.js-item-element').data('item-id');
}

function expandBookmark(id) {
  store.findById(id).expanded = true;
}

function handleBookmarkExpand() {
  $(`main`).on('click', '.fa-plus', (event) => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    expandBookmark(id);
    render();
  });
}

function collapseBookmark(id) {
  store.findById(id).expanded = false;
  render();
}

function handleBookmarkCollapse() {
  $('main').on('click', '.fa-minus', (event) => {
    event.preventDefault();
    let id = $(event.target).closest('li').attr('id');
    collapseBookmark(id);
    render();
  });
}

function handleDeleteItemClicked() {
  // like in `handleItemCheckClicked`, we use event delegation
  $('main').on('click', '.js-item-delete', (event) => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    // delete the item
    api
      .deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        // render the updated shopping list
        render();
      })
      .catch((err) => renderErrorMessage(err.message));
  });
}

function handleCancelNewBookmark() {
  $('main').on('click', '#cancel-button', (event) => {
    event.preventDefault();
    $('#new-bookmark-section').addClass('hidden');
  });
}

function handleFilterChange() {
  $('main').on('change', '.min-rating-selector', (event) => {
    store.changeFilter($(event.target).val());
    render();
  });
}

function bindEventListeners() {
  handleNewBookmarkButton();
  handleNewItemSubmit();
  handleDeleteItemClicked();
  handleBookmarkExpand();
  handleBookmarkCollapse();
  handleFilterChange();
  handleCancelNewBookmark();
}

// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners,
};
