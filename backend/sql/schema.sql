DROP TABLE IF EXISTS setlist_song;
DROP TABLE IF EXISTS song_measure_settings;
DROP TABLE IF EXISTS measure_settings;
DROP TABLE IF EXISTS setlists;
DROP TABLE IF EXISTS songs;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    bpm INT NOT NULL,
    numerator INT NOT NULL,
    denominator INT NOT NULL,
    beat_mask INT[],
    skipping_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE measure_settings (
    id SERIAL PRIMARY KEY,
    measures_on INT DEFAULT 1,
    measures_off INT DEFAULT 1
);

CREATE TABLE song_measure_settings (
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    measure_settings_id INT REFERENCES measure_settings(id) ON DELETE CASCADE,
    PRIMARY KEY (song_id, measure_settings_id)
);

CREATE TABLE setlists (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE setlist_song (
    setlist_id INT REFERENCES setlists(id) ON DELETE CASCADE,
    song_id INT REFERENCES songs(id) ON DELETE CASCADE,
    PRIMARY KEY (setlist_id, song_id)
);
