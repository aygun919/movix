document.addEventListener("DOMContentLoaded", () => {
  const movieLists = document.querySelectorAll(".movie-list-wrapper");

  movieLists.forEach((wrapper) => {
    const list = wrapper.querySelector(".movie-list");
    const rightArrow = wrapper.querySelector(".right-arrow");
    const itemWidth = 310; 
    const totalItems = list.children.length;
    const visibleItems = Math.floor(wrapper.offsetWidth / itemWidth); 
    const maxIndex = totalItems - visibleItems; 
    let currentIndex = 0;

    rightArrow.addEventListener("click", () => {
      currentIndex++;
      if (currentIndex > maxIndex) {
        currentIndex = 0; 
      }
      list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.querySelector('.search-icon');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.getElementById('searchResults');

    // Arama ikonuna tıklayınca formu aç/kapat
    searchIcon.addEventListener('click', () => {
        searchForm.style.display = searchForm.style.display === 'none' ? 'flex' : 'none';
        searchForm.classList.toggle('active');
        if (searchForm.style.display === 'flex') {
            searchInput.focus(); // Form açıldığında input'a odaklan
        }
    });

    // Form submit edildiğinde arama yap
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const term = searchInput.value.trim();
        if (!term) {
            alert('Lütfen bir film veya dizi adı gir!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/search?term=${encodeURIComponent(term)}`);
            const data = await response.json();
            const movieList = document.getElementById('movieList');
            const searchTitle = document.getElementById('searchTitle');

            movieList.innerHTML = '';
            searchResults.style.display = 'block'; // Sonuçları göster

            if (data.length === 1) {
                // Tek sonuç varsa direkt o filme yönlendir
                window.location.href = `film.html?id=${data[0].MovieID}`;
            } else if (data.length > 0) {
                // Birden fazla sonuç varsa listele
                searchTitle.textContent = `Arama Sonuçları: "${term}" (${data.length} sonuç)`;
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'movie-item';
                    li.innerHTML = `
                        <a href="film.html?id=${item.MovieID}" style="color: inherit; text-decoration: none;">
                            <img class="movie-item-img" src="${item.ImageUrl}" alt="${item.Title} posteri">
                            <div class="movie-item-info">
                                <span class="movie-item-title">${item.Title}</span>
                                <div class="movie-item-buttons">
                                    <i class="bi bi-play-circle-fill"></i>
                                    <i class="bi bi-hand-thumbs-up-fill"></i>
                                    <i class="bi bi-hand-thumbs-down-fill"></i>
                                    <i class="bi bi-plus-circle-fill"></i>
                                </div>
                            </div>
                        </a>
                    `;
                    movieList.appendChild(li);
                });
            } else {
                searchTitle.textContent = `"${term}" için sonuç bulunamadı.`;
            }

            // Arama tamamlandıktan sonra formu kapat
            searchForm.style.display = 'none';
            searchForm.classList.remove('active');
            searchInput.value = ''; // Input'u temizle
        } catch (err) {
            console.error('Arama hatası:', err);
            searchTitle.textContent = 'Aradığınız Film ya da Dizi bulunamadı.';
            searchResults.style.display = 'block';
        }
    });

    // Dışarı tıklandığında arama formunu kapat
    document.addEventListener('click', (e) => {
        if (!searchForm.contains(e.target) && !searchIcon.contains(e.target) && !searchResults.contains(e.target)) {
            searchForm.style.display = 'none';
            searchForm.classList.remove('active');
            searchResults.style.display = 'none'; // Sonuçları da gizle
        }
    });

    // Mevcut carousel kodun devam eder...
});
document.addEventListener('DOMContentLoaded', () => {
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    profileIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // tıklamayı dış tık olayına iletme
        profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
    });

    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target) && e.target !== profileIcon) {
            profileDropdown.style.display = 'none';
        }
    });
});
