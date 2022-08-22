import {useQuery} from "@tanstack/react-query";
import styled from "styled-components";
import {IGetResult, TvApi} from "../api";
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
  font-size: 40px;
  font-weight: 600;
  margin: 40px 20px 10px 20px;
`;

const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const offset = 6;

function Tv() {
  const navigate = useNavigate();
  const bigTvMatch: PathMatch<string> | null = useMatch("/tv/:id");

  const {data: airingTodayData, isLoading: isAiringTodayLoading} =
    useQuery<IGetResult>(["Tv", "nowPlaying"], TvApi.getAiringToday);
  const {data: popularData, isLoading: isPopularLoading} = useQuery<IGetResult>(
    ["Tv", "popular"],
    TvApi.getPopular
  );
  const {data: topRatedData, isLoading: isTopRatedLoading} =
    useQuery<IGetResult>(["Tv", "topRated"], TvApi.getTopRated);
  const {data: onTheAirData, isLoading: isUpcomingLoading} =
    useQuery<IGetResult>(["Tv", "upComing"], TvApi.getOnTheAir);

  const onBoxClicked = (tvId: number) => {
    navigate(`/tv/${tvId}`);
  };
  const onOverlayClick = () => navigate("/tv");

  let clickedTv;

  if (bigTvMatch?.params.id) {
    const isAiringTodayData = airingTodayData?.results.find(
        (movie) => movie.id === Number(bigTvMatch.params.id)
      ),
      isPopularData = popularData?.results.find(
        (movie) => movie.id === Number(bigTvMatch.params.id)
      ),
      isTopRatedData = topRatedData?.results.find(
        (movie) => movie.id === Number(bigTvMatch.params.id)
      ),
      isOnTheAirData = onTheAirData?.results.find(
        (movie) => movie.id === Number(bigTvMatch.params.id)
      );

    if (isAiringTodayData) {
      clickedTv = isAiringTodayData;
    } else if (isPopularData) {
      clickedTv = isPopularData;
    } else if (isTopRatedData) {
      clickedTv = isTopRatedData;
    } else if (isOnTheAirData) {
      clickedTv = isOnTheAirData;
    } else {
      console.error("보려는 프로그램의 정보가 없습니다!");
    }
  }

  const isLoading =
    isAiringTodayLoading ||
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
              airingTodayData?.results[1].backdrop_path || ""
            )}
          >
            <Title>{airingTodayData?.results[1].name}</Title>
            <Overview>{airingTodayData?.results[1].overview}</Overview>
          </Banner>
          <HSliderTitle>Airing Today</HSliderTitle>
          <HSlider
            key={"nowPlaying"}
            sliderId={"nowPlaying"}
            offset={offset}
            data={airingTodayData}
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
          <HSliderTitle>On The Air</HSliderTitle>
          <HSlider
            key={"upcoming"}
            sliderId={"upcoming"}
            offset={offset}
            data={onTheAirData}
            onBoxClicked={onBoxClicked}
          />
          <DetailModal
            bigMatch={bigTvMatch}
            onOverlayClick={onOverlayClick}
            clickedProgram={clickedTv}
          />
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
