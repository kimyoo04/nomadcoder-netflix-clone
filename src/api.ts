import {QueryFunctionContext} from "@tanstack/react-query";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IKnown {
  backdrop_path?: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface Idata {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title?: string;
  name?: string;
  overview: string;
  popularity: number;
  known_for: IKnown[];
  known_for_department?: string;
  vote_average?: number;
  vote_count?: number;
}

export interface IGetResult {
  page: number;
  results: Idata[];
  total_pages: number;
  total_results: number;
}

export const MovieApi = {
  getNowPlayingMovie() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getPopularMovie() {
    return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getTopRatedMovie() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getUpcomingMovie() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
};

export const TvApi = {
  getAiringToday() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getPopular() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getTopRated() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
  getOnTheAir() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
      (response) => response.json()
    );
  },
};

export const SearchApi = {
  getPeople: ({queryKey}: QueryFunctionContext) => {
    const [_, query] = queryKey;
    return fetch(
      `${BASE_PATH}/search/person?api_key=${API_KEY}&query=${query}`
    ).then((response) => response.json());
  },
  getMovie: ({queryKey}: QueryFunctionContext) => {
    const [_, query] = queryKey;
    return fetch(
      `${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${query}`
    ).then((response) => response.json());
  },
  getTv: ({queryKey}: QueryFunctionContext) => {
    const [_, query] = queryKey;
    return fetch(
      `${BASE_PATH}/search/tv?api_key=${API_KEY}&query=${query}`
    ).then((response) => response.json());
  },
};
