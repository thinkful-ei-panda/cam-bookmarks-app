const BASE_URL = 'https://thinkful-list-api.herokuapp.com/cam';

function listApiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      console.log(res);
      if (!res.ok) {
        // Valid HTTP response but non-2xx status - let's create an error!
        error = { code: res.status };
      }
      // In either case, parse the JSON stream:
      return res.json();
    })

    .then(data => {
      // If error was flagged, reject the Promise with the error object
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      // Otherwise give back the data as resolved Promise
      return data;
    });
}

function getBookmarks() {
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

/**
 * 
 * @param {string} title 
 * @param {string} url 
 * @param {string} desc 
 * @param {number} rating 
 */
function createBookmark(title, url, desc = '', rating) {
  let newBookmark = {
    title: title,
    url: url,
    desc: desc,
    rating: rating
  };
  console.log(newBookmark);
  console.log(typeof title);
  console.log(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBookmark)
  });
  return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newBookmark)
  });
}

/**
 * 
 * @param {string} id 
 * @param {string} title 
 * @param {string} url 
 * @param {string} desc 
 * @param {number} rating 
 */
function updateBookmark(id, title, url, desc = '', rating) {
  let updateBookmark = JSON.stringify({
    id: id,
    title: title,
    url: url,
    desc: desc,
    rating: rating
  });
  return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: updateBookmark
  });
}

/**
 * 
 * @param {string} id 
 */
function deleteBookmark(id) {
  return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};