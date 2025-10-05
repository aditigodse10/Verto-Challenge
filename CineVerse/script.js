const customTailwindConfig = {
    theme: {
        extend: {
            colors: {
                'baby-pink': '#F4C2C2',
                'butter-yellow': '#FAFAD2',
                'light-bg': '#FFF8F8',
                'light-card': '#FFFFFF',
                'dark-text': '#14141d',
            },
            spacing: {
                '35p': '35%',
                '65p': '65%',
            },
            keyframes: {
                curtainWave: {
                    '0%, 100%': { transform: 'skewY(0deg)' },
                    '50%': { transform: 'skewY(0.5deg)' },
                },
            },
            animation: {
                curtainWave: 'curtainWave 10s ease-in-out infinite alternate',
            },
        },
    },
};
if (window.tailwind) {
    window.tailwind.config = customTailwindConfig;
}

const OMDB_API_KEY = '65c4bfa5';
const POPULAR_SEARCH_TERMS = ['action', 'adventure', 'comedy', 'drama', 'horror'];
const MIN_SEARCH_LENGTH = 1;
const WATCHLIST_KEY = 'aditis_cineverse_watchlist';

let appState = {
    currentView: 'Home',
    searchResults: [],
    popularMovies: [],
    watchlist: [],
    loading: false,
    apiQuery: '',
    toast: { message: '', isVisible: false },
};

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
};

const getLocalWatchlist = () => {
    try {
        const list = localStorage.getItem(WATCHLIST_KEY);
        return list ? JSON.parse(list) : [];
    } catch (e) {
        console.error("Error loading watchlist from localStorage:", e);
        return [];
    }
};

const saveLocalWatchlist = (list) => {
    try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    } catch (e) {
        console.error("Error saving watchlist to localStorage:", e);
    }
};

const showToast = (message) => {
    appState.toast = { message, isVisible: true };
    render();
    setTimeout(() => {
        appState.toast = { message: '', isVisible: false };
        render();
    }, 3000);
};

const fetchMovies = async (query, isPopular = false) => {
    if (!query) return [];
    const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP status: ${response.status}`);
        const data = await response.json();
        if (data.Response === 'True' && Array.isArray(data.Search)) {
            return data.Search.filter(m => m.Poster && m.Poster !== 'N/A').slice(0, isPopular ? 3 : 10);
        }
        return [];
    } catch (e) {
        console.error(`Fetch failed for ${query}:`, e);
        return [];
    }
};

const fetchPopularMovies = async () => {
    appState.loading = true;
    render();
    let allMovies = [];
    const shuffledTerms = POPULAR_SEARCH_TERMS.sort(() => 0.5 - Math.random());
    for (const term of shuffledTerms) {
        if (allMovies.length >= 15) break;
        const results = await fetchMovies(term, true);
        allMovies.push(...results.slice(0, 3));
    }
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.imdbID, movie])).values()).slice(0, 15);
    appState.popularMovies = uniqueMovies;
    appState.loading = false;
    render();
};

const handleSearch = async (query) => {
    const trimmedQuery = query.trim();
    appState.apiQuery = trimmedQuery;
    if (trimmedQuery.length >= MIN_SEARCH_LENGTH) {
        appState.loading = true;
        render();
        const results = await fetchMovies(trimmedQuery);
        appState.searchResults = results;
        appState.loading = false;
        render();
    } else {
        appState.searchResults = [];
        appState.apiQuery = '';
        render();
    }
};

const clearSearch = () => {
    appState.apiQuery = '';
    appState.searchResults = [];
    render();
};

const debouncedSearch = debounce(handleSearch, 500);

const addToWatchlist = (movie) => {
    if (appState.watchlist.some(item => item.imdbID === movie.imdbID)) {
        showToast(`${movie.Title} is already added!`);
        return;
    }
    const newItem = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Type: movie.Type,
    };
    appState.watchlist = [newItem, ...appState.watchlist];
    saveLocalWatchlist(appState.watchlist);
    showToast(`${movie.Title} added to Watchlist!`);
    render();
};

const removeFromWatchlist = (imdbID) => {
    const itemToRemove = appState.watchlist.find(item => item.imdbID === imdbID);
    appState.watchlist = appState.watchlist.filter(item => item.imdbID !== imdbID);
    saveLocalWatchlist(appState.watchlist);
    if (itemToRemove) {
        showToast(`${itemToRemove.Title} removed.`);
    }
    render();
};

const AppHeader = () => `
    <header class="sticky top-0 z-50 w-full bg-light-bg/90 backdrop-blur-sm shadow-xl border-b border-baby-pink">
        <div class="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 sm:px-8">
            <h1 class="text-2xl font-extrabold text-dark-text tracking-widest">
                Aditi's <span class="text-baby-pink">CineVerse</span>
            </h1>
            <nav class="flex space-x-4">
                <button id="home-btn" class="px-3 py-1 rounded-full font-bold text-sm transition-all ${appState.currentView === 'Home' ? 'bg-baby-pink text-dark-text shadow-lg' : 'text-dark-text hover:bg-butter-yellow/50'}">
                    Home
                </button>
                <button id="watchlist-btn" class="px-3 py-1 rounded-full font-bold text-sm relative transition-all ${appState.currentView === 'Watchlist' ? 'bg-baby-pink text-dark-text shadow-lg' : 'text-dark-text hover:bg-butter-yellow/50'}">
                    Watchlist
                    ${appState.watchlist.length > 0 ? `
                        <span class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-light-card text-xs font-bold px-2 py-0.5 rounded-full">
                            ${appState.watchlist.length}
                        </span>` : ''}
                </button>
            </nav>
        </div>
    </header>
`;

const MovieReelHero = () => `
    <div id="movie-reel-hero" class="relative w-full overflow-hidden max-h-[50vh] min-h-[300px] bg-light-bg border-b-4 border-baby-pink/50 flex items-center justify-center">
        <div id="curtain-left" class="absolute inset-0 flex">
            <div class="w-1/2 h-full bg-baby-pink/80 origin-top-right animate-curtainWave" style="background: linear-gradient(90deg, #FFF8F8 0%, #F4C2C2 100%);"></div>
            <div class="w-1/2 h-full bg-baby-pink/80 origin-top-left animate-curtainWave" style="background: linear-gradient(-90deg, #FFF8F8 0%, #F4C2C2 100%);"></div>
        </div>
        <div id="hero-title" class="absolute inset-0 flex items-center justify-center z-20">
            <h2 class="text-6xl sm:text-7xl font-extrabold text-dark-text tracking-widest text-center drop-shadow-[0_4px_4px_rgba(244,194,194,0.7)]">
                Aditi's <span class="text-butter-yellow drop-shadow-md">CineVerse</span>
            </h2>
        </div>
    </div>
`;
const MovieCard = (movie, isWatchlisted) => {
    const posterUrl = (movie.Poster && movie.Poster !== 'N/A')
        ? movie.Poster
        : 'https://placehold.co/120x180/FAFAD2/14141d?text=No+Poster';
    return `
        <div class="w-full h-44 flex bg-light-card shadow-xl border border-baby-pink/50 transform hover:scale-[1.03] transition-all duration-300 relative overflow-hidden clip-path-replicated" data-imdbid="${movie.imdbID}">
            <div class="absolute left-[35%] top-0 h-full w-0.5" style="background: repeating-linear-gradient(to bottom, #F4C2C2, #F4C2C2 5px, transparent 5px, transparent 10px);"></div>
            <div class="w-35p h-full relative overflow-hidden flex-shrink-0 bg-butter-yellow flex items-center justify-center p-2">
                <div class="w-full h-full border-2 border-baby-pink/80 shadow-inner rounded-sm overflow-hidden">
                    <img src="${posterUrl}" alt="Poster for ${movie.Title}" class="w-full h-full object-cover"/>
                </div>
            </div>
            <div class="w-65p p-4 flex flex-col justify-between flex-grow pl-5">
                <div>
                    <h3 class="text-base font-bold text-dark-text leading-tight" title="${movie.Title}">
                        ${movie.Title}
                    </h3>
                    <p class="text-sm text-baby-pink mt-1">${movie.Year} | ${movie.Type}</p>
                </div>
                ${isWatchlisted
                    ? `<button class="mt-2 py-1 px-3 bg-red-500 text-light-card rounded-full text-xs font-semibold hover:bg-red-600 transition-colors shadow-md remove-btn">Remove</button>`
                    : `<button class="mt-2 py-1 px-3 bg-butter-yellow text-dark-text rounded-full text-xs font-bold hover:bg-butter-yellow/80 transition-colors shadow-md border border-dark-text/10 add-btn">Add to Watchlist</button>`
                }
            </div>
        </div>
    `;
};
const EmptyWatchlistCard = () => `
    <div id="empty-watchlist-card" class="w-80 h-80 mx-auto">
        <div class="relative w-full h-full">
            <div class="absolute w-full h-full bg-light-card border-4 border-baby-pink rounded-xl shadow-2xl flex items-center justify-center">
                <div class="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-40 w-40 text-baby-pink mx-auto" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#FAFAD2" stroke="#F4C2C2" stroke-width="2.5"/>
                        <path d="M8 10.5 C8 10.5, 9.5 11.5, 11 10.5" stroke="#14141d" stroke-width="2" fill="none" stroke-linecap="round"/>
                        <path d="M13 10.5 C13 10.5, 14.5 11.5, 16 10.5" stroke="#14141d" stroke-width="2" fill="none" stroke-linecap="round"/>
                        <path d="M9 16.5 C10 15, 14 15, 15 16.5" stroke="#14141d" stroke-width="2" fill="none" stroke-linecap="round" transform="translate(0, 0.5)"/>
                        <path d="M8.5 11 L7.5 14 C8 15, 9 14, 8.5 13.5 Z" fill="#3b82f6" opacity="0.9"/>
                        <path d="M15.5 11 L16.5 14 C16 15, 15 14, 15.5 13.5 Z" fill="#3b82f6" opacity="0.9"/>
                    </svg>
                    <p class="text-xl font-bold text-dark-text mt-4 text-baby-pink">It's so empty here...</p>
                    <button id="browse-btn" class="mt-6 px-6 py-2 bg-butter-yellow text-dark-text rounded-full font-bold hover:bg-butter-yellow/80 transition-colors shadow-lg border border-dark-text/10">
                        Browse Movies
                    </button>
                </div>
            </div>
        </div>
    </div>
`;

const Toast = (message, isVisible) => `
    <div id="toast" class="fixed bottom-6 right-6 transition-all duration-500 ease-out z-50 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}">
        <div class="bg-baby-pink text-dark-text p-4 rounded-xl shadow-2xl border-4 border-butter-yellow font-semibold flex items-center">
            ${message}
        </div>
    </div>
`;

const renderHomeScreen = () => `
    ${MovieReelHero()}
    <section class="max-w-7xl mx-auto px-4 sm:px-8 mt-10 relative">
        <div class="relative">
            <input type="text" id="search-box" placeholder="Search movies..." class="w-full p-3 pr-10 rounded-xl border border-baby-pink text-dark-text focus:outline-none focus:ring-2 focus:ring-baby-pink/70 focus:border-baby-pink shadow-md"/>
            ${appState.apiQuery ? `<button id="clear-search" class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text text-lg font-bold">&times;</button>` : ''}
        </div>
        ${appState.loading ? `
            <p class="text-center mt-8 text-dark-text text-lg animate-pulse">Loading movies...</p>
        ` : appState.apiQuery && appState.searchResults.length === 0 ? `
            <p class="text-center mt-8 text-dark-text">No movies found for "<strong>${appState.apiQuery}</strong>".</p>
        ` : ''}
        ${appState.apiQuery && appState.searchResults.length > 0 ? `
            <h2 class="text-2xl font-bold mt-12 mb-4 text-dark-text text-center">Search Results</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${appState.searchResults.map(movie =>
                    MovieCard(movie, appState.watchlist.some(w => w.imdbID === movie.imdbID))
                ).join('')}
            </div>
        ` : `
            <h2 class="text-2xl font-bold mt-12 mb-4 text-dark-text text-center">Popular Now</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${appState.popularMovies.map(movie =>
                    MovieCard(movie, appState.watchlist.some(w => w.imdbID === movie.imdbID))
                ).join('')}
            </div>
        `}
    </section>
`;

const renderWatchlistScreen = () => `
    <section class="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <h2 class="text-2xl font-bold mb-8 text-dark-text text-center">My Watchlist</h2>
        ${appState.watchlist.length === 0 ? EmptyWatchlistCard() : `
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                ${appState.watchlist.map(movie => MovieCard(movie, true)).join('')}
            </div>
        `}
    </section>
`;

const render = () => {
    const root = document.getElementById('root');
    if (!root) return;
    root.innerHTML = `
        ${AppHeader()}
        <main>
            ${appState.currentView === 'Home' ? renderHomeScreen() : renderWatchlistScreen()}
        </main>
        ${Toast(appState.toast.message, appState.toast.isVisible)}
    `;
    document.getElementById('home-btn')?.addEventListener('click', () => {
        appState.currentView = 'Home';
        render();
    });
    document.getElementById('watchlist-btn')?.addEventListener('click', () => {
        appState.currentView = 'Watchlist';
        render();
    });
    document.getElementById('browse-btn')?.addEventListener('click', () => {
        appState.currentView = 'Home';
        render();
    });
    document.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const imdbID = e.target.closest('[data-imdbid]').dataset.imdbid;
            const movie = [...appState.searchResults, ...appState.popularMovies].find(m => m.imdbID === imdbID);
            if (movie) addToWatchlist(movie);
        });
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const imdbID = e.target.closest('[data-imdbid]').dataset.imdbid;
            removeFromWatchlist(imdbID);
        });
    });
    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.value = appState.apiQuery;
        searchBox.addEventListener('input', (e) => debouncedSearch(e.target.value));
    }
    document.getElementById('clear-search')?.addEventListener('click', clearSearch);
};

const initApp = async () => {
    appState.watchlist = getLocalWatchlist();
    render();
    await fetchPopularMovies();
};
window.addEventListener('DOMContentLoaded', initApp);
