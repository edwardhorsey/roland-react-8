import { type NextPage } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";

const App = dynamic(() => import("~/containers/App"), {
    ssr: false,
});

const siteUrl = "https://drummachine.xyz";
const title = "Drum Machine";
const description =
    "A drum-machine performing some of my favourite samples from the Roland TR-808.";
const ogImage = "https://drummachine.xyz/og.png";
const themeColour = "#e5e7eb";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Roland React 8</title>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content={description} />
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="theme-color" content={themeColour} />
                <link rel="canonical" href={siteUrl} />
                <meta name="title" content={title} />
                <meta name="description" content={description} />
                <meta property="og:locale" content="en_GB" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={siteUrl} />
                <meta property="og:site_name" content={title} />
                <meta property="og:image" content={ogImage} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:image" content={ogImage} />
                <link rel="apple-touch-icon" href={ogImage} />
            </Head>
            <App />
        </>
    );
};

export default Home;
