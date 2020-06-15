const baseURL = 'https://thinkful-list-api.herokuapp.com/cam/bookmarks';

function postString(name,url,desc,rating) {
  const URL = baseURL + `{"title": "${name}", "url": "${url}", "desc": "${desc}", "rating": ${rating}}`;
  return URL;
}

function deleteString(id) {
  const URL = baseURL + 
}