const mykey = 'f8802275';
var movies_array = [];
const Page = 10;
let cp = 1;
let totalmovie = 0;

var btn = document.getElementById("search");
btn.addEventListener("click", () => go(cp));

function go(upper) {
    var input = document.getElementById("value").value;
    fetch(`https://www.omdbapi.com/?s=${input}&page=${upper}&apikey=${mykey}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('There is some error');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            if (data) {
                movies_array.push(...data.Search);
                totalmovie = parseInt(data.totalResults);
                show(upper);
                mypages();
            }
            else {
                throw new Error('Error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}


function show() {
    const mymovies = document.getElementById('movie');
    mymovies.innerHTML = '';
    const start = (cp - 1) * Page;
    const finish = Math.min(start + Page, movies_array.length);
    for (let i = start; i < finish; i++) {
        const ele = document.createElement('div');
        const poster = movies_array[i].Poster !== 'N/A' ? movies_array[i].Poster : 'Sorry no poster';
        ele.innerHTML = `<img src="${poster}" <span class="movie-title">${movies_array[i].Title}</span>`;
        ele.addEventListener('click', () => detailing(movies_array[i].imdbID));
        mymovies.appendChild(ele);
    }
}

function mypages() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    const total = Math.ceil(totalmovie / Page);

    const previous = document.createElement('button');
    previous.innerText = 'Previous';
    if (cp === 1) {
        previous.disabled = true;
    }
    previous.addEventListener('click', () => {
        if (cp > 1) {
            cp--;
            previous.addEventListener("click", go(cp));
        }
    });
    pagination.appendChild(previous);

    const next = document.createElement('button');
    next.innerText = 'Next';
    if (cp === total) {
        next.disabled = true;
    }
    next.addEventListener('click', () => {
        if (cp < total) {
            cp++;
            next.addEventListener("click", go(cp));
        }
    });
    pagination.appendChild(next);
}

function detailing(slow) {
    fetch(`https://www.omdbapi.com/?i=${slow}&apikey=${mykey}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('There is some error');
        }
        return res.json();
      })
      .then(data => {
        showme(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function showme(data) {
    const details = document.getElementById('detailing');
    details.innerHTML = `
      <h1>${data.Title}</h1>
      <img src="${data.Poster}" alt="${data.Title} Poster">
      <p>Plot: ${data.Plot}</p>
      <p>Actors: ${data.Actors}</p>
      <p>Director: ${data.Director}</p>
      <p>Year: ${data.Year}</p>
      <p>IMDb Rating: ${data.imdbRating}</p>
    `;
}

