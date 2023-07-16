import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const App = dynamic(() => import("~/containers/App"), {
    ssr: false,
});

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Roland React 8</title>
                <meta
                    name="description"
                    content="A drum-machine performing some of my favourite samples from the Roland TR-808."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <App />
        </>
    );
};

export default Home;
