import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getMovies, IGetMoviesResult } from "../services/api";
import { makeImagePath } from "../services/utils";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
        // ๐ท๏ธ ๋ธ๋ผ์ฐ์  width๋งํผ
        // ๐ท๏ธ ์ ๋๋ฉ์ด์์ผ๋ก ๋์ด๊ฐ ๋ ๋ง์ง๋ง๊ณผ ์ฒ์ ์ฌ์ด ๋ถ์ด์๋ ๋ถ๋ถ gap ์ฃผ๊ธฐ ์ํด 10 ์ถ๊ฐ ๋ถ์ฌ
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
        y: -80,
        transition: {
            // ๐ท๏ธ hover ์์๋ง ์ ์ฉ
            delay: 0.5,
            duaration: 0.1,
            type: "tween", // spring -> linear
        },
    },
};

const infoVariants = {
    hover: {
        opacity: 0.8,
        transition: {
            delay: 0.5,
            duaration: 0.1,
            type: "tween",
        },
    },
};

const offset = 6;

const Home = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
    // ๐ ๋ฐฐ๋ ํด๋ฆญ ์, ์ฌ๋ผ์ด๋ ์ธ๋ฑ์ค ์ฆ๊ฐ์ํค๊ธฐ
    const [index, setIndex] = useState(0); // Slider ํ์ด์ง ์
    const [leaving, setLeaving] = useState(false); // Slider ์ ๋๋ฉ์ด์ ์งํ ์ํ
    const toggleLeaving = () => setLeaving((prev) => !prev);
    const increaseIndex = () => {
        if (data) {
            if (leaving) return;
            toggleLeaving();
            const totalMovies = data.results.length - 1; // ๋ฐฐ๋์์ ํ๋ ์ฐ์ด๊ธฐ ๋๋ฌธ
            const maxIndex = Math.floor(totalMovies / offset) - 1; // ์ด ์คํฌ๋กค ํ์ด์ง
            setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
    };

    const onBoxClicked = (movieId: number) => {
        // ๋ฐ์ค ํด๋ฆญ ์ ์ํ ์์ธ๋ณด๊ธฐ๋ก ์ด๋
        navigate(`/movies/${movieId}`);
    };
    const bigMovieMatch = useMatch("/movies/:movieId");
    // console.log(bigMovieMatch);
    const onOverlayClick = () => navigate("/"); // ์ํ ์์ธ๋ณด๊ธฐ ๋ท ๋ฐฐ๊ฒฝ ํด๋ฆญ ์, ํ์ผ๋ก ์ด๋
    const { scrollY } = useScroll();
    // ํ์ฌ movieId์ ํด๋นํ๋ ๋ฐ์ดํฐ ํ๋๋ง ๊ฐ์ ธ์ค๊ธฐ
    const clickedMovie =
        bigMovieMatch?.params.movieId &&
        data?.results.find((movie) => movie.id === +bigMovieMatch?.params.movieId!!);

    return (
        <Wrapper>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Banner
                        onClick={increaseIndex}
                        bgphoto={makeImagePath(data?.results[0].backdrop_path || "")} // ๐ท๏ธ
                    >
                        <Title>{data?.results[0].title}</Title>
                        <Overview>{data?.results[0].overview}</Overview>
                    </Banner>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                            {/* ๐ท๏ธ initial ๐ท๏ธ onExitComplete */}
                            <Row
                                variants={rowVariants} // ๐ท๏ธ
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ type: "tween", duration: 1 }} // ๐ท๏ธ tween === linear animation
                                key={index} // ๐ท๏ธ index๋ฅผ ๋ฐ๊ฟ์ ๋ค๋ฅธ ์ปดํฌ๋ํธ๋ก ์ธ์์์ผ์ exit ์ ๋๋ฉ์ด์์ ์คํ
                            >
                                {data?.results
                                    .slice(1) // ์ฒซ ๋ฒ์งธ ์์๋ฅผ ์ ์ธํ ๋๋จธ์ง ์์๋ค ๋ฐํ
                                    .slice(offset * index, offset * index + offset)
                                    .map((movie) => (
                                        <Box
                                            layoutId={movie.id + ""}
                                            key={movie.id}
                                            variants={boxVariants}
                                            initial="normal"
                                            whileHover="hover"
                                            transition={{ type: "tween" }} // ๋ชจ๋  ์ ๋๋ฉ์ด์ linear
                                            onClick={() => onBoxClicked(movie.id)}
                                            bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                                        >
                                            <Info variants={infoVariants}>
                                                {/* ๐ท๏ธ ๋ถ๋ชจ์์ ์ค์ ๋ animation ์ค์ ๋ค์ด ๊ทธ๋๋ก ์์๋๋ค. */}
                                                <h4>{movie.title}</h4>
                                            </Info>
                                        </Box>
                                    ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Overlay
                                    onClick={onOverlayClick}
                                    exit={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                                <BigMovie
                                    style={{ top: scrollY.get() + 100 }}
                                    layoutId={bigMovieMatch.params.movieId}
                                >
                                    {clickedMovie && (
                                        <>
                                            <BigCover
                                                style={{
                                                    backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                                        clickedMovie.backdrop_path,
                                                        "w500"
                                                    )})`,
                                                }}
                                            />
                                            <BigTitle>{clickedMovie.title}</BigTitle>
                                            <BigOverview>{clickedMovie.overview}</BigOverview>
                                        </>
                                    )}
                                </BigMovie>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
};

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

const Banner = styled.div<{ bgphoto: string }>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
        url(${(props) => props.bgphoto});
    // ๐ท๏ธ ๋ฐฐ๊ฒฝํ๋ฉด์ ๊ฒน์ณ์ ์ค์ ํ  ์ ์๋ค.
    // ๐ท๏ธ ๋ ๊ฒน์ ํด๋๋ ์ด์ ๋ ๊ธ์๊ฐ ๋ฐ๋ก ํฌ์คํฐ์ ๊ฒน์น๋ฉด ๊ฐ๋์ฑ์ด ๋จ์ด์ง๊ธฐ ๋๋ฌธ
    background-size: cover;
`;

const Title = styled.h2`
    font-size: 4vw;
    margin-bottom: 20px;
`;

const Overview = styled.p`
    font-size: 1.2vw;
    font-weight: 400;
    line-height: 150%;
    width: 45%;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    gap: 0.5vw;
    grid-template-columns: repeat(6, 1fr);
    position: absolute;
    width: 98%;
    left: 1%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
    background-color: white;
    background-image: url(${(props) => props.bgphoto});
    background-size: cover;
    background-position: center center;
    height: 8.5vw;
    border-radius: 10px;
    cursor: pointer;
    &:first-child {
        transform-origin: center left; // ๐ท๏ธ ์ค๋ฅธ์ชฝ์ผ๋ก๋ง ์ปค์ง๋๋ก ๋ง๋ค์ด์ ์งค๋ฆฌ์ง ์๋๋ก
    }
    &:last-child {
        transform-origin: center right; // ๐ท๏ธ ์ผ์ชฝ์ผ๋ก๋ง ์ปค์ง๋๋ก ๋ง๋ค์ด์ ์งค๋ฆฌ์ง ์๋๋ก
    }
`;

const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4 {
        text-align: center;
        font-size: 16px;
    }
`;

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
    width: 40vw;
    height: 80vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    border-radius: 15px;
    overflow: hidden;
    background-color: ${(props) => props.theme.black.lighter};
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
    top: -80px;
`;

const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${(props) => props.theme.white.lighter};
`;

export default Home;
