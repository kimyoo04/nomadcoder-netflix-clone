import {useQuery} from "@tanstack/react-query";
import styled from "styled-components";
import {MovieApi, IGetResult} from "../api";
import {makeImagePath} from "../utils";
import {useNavigate, useMatch, PathMatch} from "react-router-dom";
import DetailModal from "../Components/DetailModal";
import HSlider from "../Components/HSlider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgphoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 800;
  margin-bottom: 20px;
`;

const HSliderTitle = styled.h3`
  font-size: 36px;
  font-weight: 600;
  margin: 40px 20px 10px 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:id");

  const {data: nowPlayingData, isLoading: isNowPlayingLoading} =
    useQuery<IGetResult>(["movies", "nowPlaying"], MovieApi.getNowPlayingMovie);
  const {data: popularData, isLoading: isPopularLoading} = useQuery<IGetResult>(
    ["movies", "popular"],
    MovieApi.getPopularMovie
  );
  const {data: topRatedData, isLoading: isTopRatedLoading} =
    useQuery<IGetResult>(["movies", "topRated"], MovieApi.getTopRatedMovie);
  const {data: upComingData, isLoading: isUpcomingLoading} =
    useQuery<IGetResult>(["movies", "upComing"], MovieApi.getUpcomingMovie);

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate("/");

  let clickedMovie;

  if (bigMovieMatch?.params.id) {
    const isNowPlayingData = nowPlayingData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

    const isPopularData = popularData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

    const isTopRatedData = topRatedData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

    const isUpComingData = upComingData?.results.find(
      (movie) => movie.id === Number(bigMovieMatch.params.id)
    );

    if (isNowPlayingData) {
      clickedMovie = isNowPlayingData;
    } else if (isPopularData) {
      clickedMovie = isPopularData;
    } else if (isTopRatedData) {
      clickedMovie = isTopRatedData;
    } else if (isUpComingData) {
      clickedMovie = isUpComingData;
    } else {
      console.error("보려는 프로그램의 정보가 없습니다!");
    }
  }

  const isLoading =
    isNowPlayingLoading ||
    isPopularLoading ||
    isTopRatedLoading ||
    isUpcomingLoading;

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(
              nowPlayingData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{nowPlayingData?.results[0].title}</Title>
            <Overview>{nowPlayingData?.results[0].overview}</Overview>
          </Banner>
          <HSliderTitle>Now Playing</HSliderTitle>
          <HSlider
            key={"nowPlaying"}
            sliderId={"nowPlaying"}
            offset={offset}
            data={nowPlayingData}
            onBoxClicked={onBoxClicked}
          />
          <HSliderTitle>Popular</HSliderTitle>
          <HSlider
            key={"popular"}
            sliderId={"popular"}
            offset={offset}
            data={popularData}
            onBoxClicked={onBoxClicked}
          />
          <HSliderTitle>Top Rated</HSliderTitle>
          <HSlider
            key={"topRated"}
            sliderId={"topRated"}
            offset={offset}
            data={topRatedData}
            onBoxClicked={onBoxClicked}
          />
          <HSliderTitle>Upcoming</HSliderTitle>
          <HSlider
            key={"upcoming"}
            sliderId={"upcoming"}
            offset={offset}
            data={upComingData}
            onBoxClicked={onBoxClicked}
          />
          <DetailModal
            bigMatch={bigMovieMatch}
            onOverlayClick={onOverlayClick}
            clickedProgram={clickedMovie}
          />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
