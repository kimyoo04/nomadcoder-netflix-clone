import {useQuery} from "@tanstack/react-query";
import {useLocation} from "react-router";
import {useNavigate, useMatch, PathMatch} from "react-router-dom";
import styled from "styled-components";
import {SearchApi, IGetResult} from "../api";
import DetailModal from "../Components/DetailModal";
import HSlider from "../Components/HSlider";
import PeopleSlider from "../Components/PeopleSlider";

const Wrapper = styled.div``;

const Title = styled.h2`
  font-size: 58px;
  font-weight: 800;
  margin: 70px 20px;
  margin-bottom: 40px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HSliderTitle = styled.h3`
  font-size: 40px;
  font-weight: 600;
  margin: 40px 20px 10px 20px;
`;

const offset = 6;

const Search = () => {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const navigate = useNavigate();
  const bigSearchMatch: PathMatch<string> | null = useMatch("/search/:id");

  const onBoxClicked = (movieId: number) => {
    navigate(`/search/${movieId}/${location.search}`);
  };
  const onOverlayClick = () => navigate(-1);

  const {data: peopleData, isLoading: isPeopleLoading} = useQuery<IGetResult>(
      ["SearchPeople", keyword],
      SearchApi.getPeople
    ),
    {data: movieData, isLoading: isMovieLoading} = useQuery<IGetResult>(
      ["SearchMovies", keyword],
      SearchApi.getMovie
    ),
    {data: tvData, isLoading: isTvLoading} = useQuery<IGetResult>(
      ["SearchTvs", keyword],
      SearchApi.getTv
    );
  console.log(peopleData);
  let clickedTv;
  if (bigSearchMatch?.params.id) {
    const isPeopleData = peopleData?.results.find(
        (movie) => movie.id === Number(bigSearchMatch.params.id)
      ),
      isMovieData = movieData?.results.find(
        (movie) => movie.id === Number(bigSearchMatch.params.id)
      ),
      isTvData = tvData?.results.find(
        (movie) => movie.id === Number(bigSearchMatch.params.id)
      );
    if (isPeopleData) {
      clickedTv = isPeopleData;
    } else if (isMovieData) {
      clickedTv = isMovieData;
    } else if (isTvData) {
      clickedTv = isTvData;
    } else {
      console.error("보려는 프로그램의 정보가 없습니다!");
    }
  }

  const isLoading = isPeopleLoading || isMovieLoading || isTvLoading;
  return (
    <Wrapper>
      <Title>Search Results</Title>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <HSliderTitle>Person known for...</HSliderTitle>
          <PeopleSlider
            key={"searchPeople"}
            sliderId={"searchPeople"}
            offset={offset}
            data={peopleData}
            onBoxClicked={onBoxClicked}
          />
          <HSliderTitle>Movies</HSliderTitle>
          <HSlider
            key={"searchMovie"}
            sliderId={"searchMovie"}
            offset={offset}
            data={movieData}
            onBoxClicked={onBoxClicked}
          />
          <HSliderTitle>Tvs</HSliderTitle>
          <HSlider
            key={"SearchTv"}
            sliderId={"SearchTv"}
            offset={offset}
            data={tvData}
            onBoxClicked={onBoxClicked}
          />
          <DetailModal
            bigMatch={bigSearchMatch}
            onOverlayClick={onOverlayClick}
            clickedProgram={clickedTv}
          />
        </>
      )}
    </Wrapper>
  );
};
export default Search;
