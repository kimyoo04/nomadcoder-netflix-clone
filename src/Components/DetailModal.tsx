import {
  faPlay,
  faPlus,
  faStar,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AnimatePresence, motion, useScroll} from "framer-motion";
import {PathMatch} from "react-router-dom";
import styled from "styled-components";
import {Idata} from "../api";
import {makeImagePath} from "../utils";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 44vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: black;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -90px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const BigWrapper = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  top: -80px;
`;

const PlayButton = styled.div`
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 8px;
`;

const CircleButton = styled.div`
  display: flex;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 18px;
  justify-content: center;
  align-items: center;
`;

const Vote = styled.span``;

const Department = styled.span`
  padding: 20px;
`;

interface IDetailModal {
  bigMatch: PathMatch<string> | null;
  onOverlayClick: () => void;
  clickedProgram: Idata | undefined;
}

const DetailModal = ({
  bigMatch,
  onOverlayClick,
  clickedProgram,
}: IDetailModal) => {
  const {scrollY} = useScroll();

  return (
    <AnimatePresence>
      {bigMatch ? (
        <>
          <Overlay
            onClick={onOverlayClick}
            exit={{opacity: 0}}
            animate={{opacity: 1}}
          />
          <BigMovie
            style={{top: scrollY.get() + 100}}
            layoutId={bigMatch.params.movieId}
          >
            {clickedProgram?.vote_average ? (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedProgram.backdrop_path,
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>
                  {clickedProgram.title ?? clickedProgram.name}
                </BigTitle>
                <BigWrapper>
                  <PlayButton>
                    <FontAwesomeIcon icon={faPlay} style={{marginRight: 6}} />
                    Play
                  </PlayButton>
                  <CircleButton>
                    <FontAwesomeIcon icon={faPlus} />
                  </CircleButton>
                  <CircleButton>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </CircleButton>
                  <Vote>
                    <FontAwesomeIcon icon={faStar} style={{marginRight: 6}} />
                    {clickedProgram.vote_average} / 10
                  </Vote>
                </BigWrapper>
                <BigOverview>{clickedProgram.overview}</BigOverview>
              </>
            ) : (
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                      clickedProgram?.known_for[0].backdrop_path ??
                        "public/img/white.png",
                      "w500"
                    )})`,
                  }}
                />
                <BigTitle>
                  {clickedProgram?.known_for[0].title ?? "No Title"}
                </BigTitle>
                <BigWrapper>
                  <PlayButton>
                    <FontAwesomeIcon icon={faPlay} style={{marginRight: 6}} />
                    Play
                  </PlayButton>
                  <CircleButton>
                    <FontAwesomeIcon icon={faPlus} />
                  </CircleButton>
                  <CircleButton>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </CircleButton>
                  <Vote>
                    <FontAwesomeIcon icon={faStar} style={{marginRight: 6}} />
                    {clickedProgram?.known_for[0].vote_average} / 10
                  </Vote>
                  <Department>
                    Department: {clickedProgram?.known_for_department}
                  </Department>
                </BigWrapper>
                <BigOverview>
                  {clickedProgram?.known_for[0].overview}
                </BigOverview>
              </>
            )}
          </BigMovie>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default DetailModal;
