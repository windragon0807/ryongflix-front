import { Routes, Route } from "react-router-dom";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

const Router = () => {
    return (
        <>
            <Routes>
                <Route path="/tv" element={<Tv />} />
                <Route path="/search" element={<Search />} />
                {/* ๐ท๏ธ Router๋ ์์์๋ถํฐ ์ผ์นํ๋ ๋ถ๋ถ์ ์ฐพ์๋ด๊ธฐ ๋๋ฌธ์ ์ค๋ณต๋๋ ๊ฒฝ๋ก๊ฐ ์์ผ๋ฉด ๋ค๋ก ๋นผ์ผ ํ๋ค. */}
                <Route path="/" element={<Home />}>
                    <Route path="/movies/:movieId" element={<Home />} />
                </Route>
            </Routes>
        </>
    );
};

export default Router;
