import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwticher.jsx';
import './App.css';

const API_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
    const { t, i18n } = useTranslation();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch(API_URL, {
            headers: {
                'Accept-Language': i18n.language,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP Error: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                setMovies(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [i18n.language]);

    const filteredMovies = movies.filter(m =>
        (m.title && m.title.toLowerCase().includes(search.toLowerCase())) ||
        (m.director && m.director.toLowerCase().includes(search.toLowerCase())) ||
        (m.genre && m.genre.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="status-screen">
                <p>{t('movies.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="status-screen error">
                <p>{t('movies.error', { error })}</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem' }}>
                <LanguageSwitcher />
            </div>

            <div className="page-header">
                <h1>{t('movies.title')}</h1>
                <p>{t('movies.subtitle')}</p>
            </div>

            <div className="toolbar">
                <input
                    type="text"
                    placeholder={t('movies.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
                <span className="count-hint">
                    {t('movies.shownCount', { count: filteredMovies.length })}
                </span>
            </div>

            {filteredMovies.length === 0 ? (
                <div className="empty-state">
                    <h3>{t('movies.noResultsTitle')}</h3>
                    <p>{t('movies.noResultsDesc')}</p>
                </div>
            ) : (
                <div className="movie-grid">
                    {filteredMovies.map((movie) => (
                        <div className="movie-card-wrapper" key={movie.id}>
                            <div className="movie-card">
                                <div className="poster-wrapper">
                                    <img
                                        src={movie.img}
                                        alt={movie.title}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x420?text=No+Poster'; }}
                                    />
                                    <div className="poster-overlay"></div>
                                    <span className="type-badge">{movie.type}</span>
                                    <span className="year-badge">{movie.releaseYear}</span>
                                </div>
                                <div className="card-body">
                                    <h5 className="movie-title">{movie.title}</h5>

                                    <div className="genre-tags">
                                        {(movie.genre || "").split(',').map((genre, idx) => (
                                            <span className="genre-tag" key={idx}>{genre.trim()}</span>
                                        ))}
                                    </div>

                                    <p className="description">{movie.description}</p>

                                    <div className="action-bar">
                                        <button className="btn-action btn-action-details">{t('movies.details')}</button>
                                        <button className="btn-action btn-action-edit">{t('movies.edit')}</button>
                                        <button className="btn-action btn-action-delete">{t('movies.delete')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;