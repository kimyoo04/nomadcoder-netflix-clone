import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import styled from "styled-components";
import {IGetResult} from "../api";

const Wrapper = styled.div`
  margin: 20px;
  height: 100px;
`;

const NotFoundText = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

const Slider = styled.div`
  position: relative;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;
const Box = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  height: 100px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
  height: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const PrevIcon = styled(motion.div)`
  position: absolute;
  top: 42px;
  left: 6px;
  z-index: 3;
`;
const NextIcon = styled(motion.div)`
  position: absolute;
  top: 42px;
  right: 6px;
  z-index: 3;
`;

const OverlayLeft = styled.div`
  position: absolute;
  left: 0;
  width: 100px;
  height: 100px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  z-index: 2;
`;
const OverlayRight = styled.div`
  position: absolute;
  right: 0;
  width: 100px;
  height: 200px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 2;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

interface IHSider {
  sliderId: string;
  offset: number;
  data: IGetResult | undefined;
  onBoxClicked: (movieId: number) => void;
}

const PeopleSlider = ({sliderId, offset, data, onBoxClicked}: IHSider) => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);

  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const MaxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? MaxIndex : prev - 1));
    }
  };

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <>
      <Wrapper>
        {data?.results.length === 0 ? (
          <NotFoundText>
            The resource you requested could not be found.
          </NotFoundText>
        ) : (
          <Slider>
            <PrevIcon whileHover={{scale: 2}}>
              <FontAwesomeIcon
                onClick={decreaseIndex}
                icon={faChevronLeft}
                size="lg"
              />
            </PrevIcon>
            <OverlayLeft />
            <NextIcon whileHover={{scale: 2}}>
              <FontAwesomeIcon
                onClick={increaseIndex}
                icon={faChevronRight}
                size="lg"
              />
            </NextIcon>
            <OverlayRight />
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{type: "tween", duration: 1}}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((program) => (
                    <Box
                      layoutId={program.id + sliderId}
                      key={program.id + sliderId}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(program.id)}
                      transition={{type: "tween"}}
                    >
                      <Info variants={infoVariants}>
                        <h4>{program.title ?? program.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        )}
      </Wrapper>
    </>
  );
};

export default PeopleSlider;
