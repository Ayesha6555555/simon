let baseUrl = "https://openlibrary.org/search.json?title=";

let searchBook = async function () {
    let bookName = document.querySelector('.book-name').value.trim();
    if (!bookName) {
        alert('Please enter a book name');
        return;
    }
    let loadingIndicator = document.querySelector('.loading');
    loadingIndicator.style.display = 'block';

    let res = await fetch(baseUrl + encodeURIComponent(bookName));
    let data = await res.json();
    let resultsContainer = document.querySelector('.book-details');
    resultsContainer.innerHTML = '';
    let resultsHeader = document.querySelector('.results-header');
    resultsHeader.textContent = `Search results for "${bookName}"`;
    let displayedBooks = new Set();

    if (data.docs && data.docs.length > 0) {
        data.docs.forEach(book => {
            let title = book.title;
            let authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
            let genre = book.subject ? book.subject[0] : 'Unknown Genre';
            let coverId = book.cover_i;

            // Check if the book has a cover and if it's not a duplicate
            if (coverId && !displayedBooks.has(`${title} by ${authors}`)) {
                displayedBooks.add(`${title} by ${authors}`); // Add to the set of displayed books

                resultsContainer.innerHTML += `
                    <div class="book-item">
                        <img class="book-cover" src="https://covers.openlibrary.org/b/id/${coverId}-L.jpg" alt="${title}">
                        <div class="book-info">
                            <p class="book-title">${title}</p>
                            <p class="author-name">Author: ${authors}</p>
                            <p class="book-genre">Genre: ${genre}</p>
                        </div>
                    </div>
                `;
            }
        });

        if (displayedBooks.size === 0) {
            resultsContainer.innerHTML = '<p>No books found with cover images for the given name.</p>';
        }
    } else {
        alert('No books found for the given name');
    }

    loadingIndicator.style.display = 'none';
};

document.querySelector('.search').addEventListener('click', searchBook);

let clearIcon = document.querySelector('.icon-clear');
let searchInput = document.querySelector('.book-name');

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        searchBook();
    }
});

searchInput.addEventListener('input', function () {
    clearIcon.style.display = searchInput.value ? 'inline' : 'none';
});

clearIcon.addEventListener('click', function () {
    searchInput.value = '';
    clearIcon.style.display = 'none';
});
