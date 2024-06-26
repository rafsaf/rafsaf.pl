import React from "react";
import Head from "next/head";
import Hero from "../components/globals/Hero";
import Skills from "../components/index/skills";
import TimeLine from "../components/index/timeline";
import Picture from "next-export-optimize-images/picture";
import MeImg from "../public/me_2023_600x600.webp";

const index = () => {
  return (
    <>
      <Head>
        <title>Rafał Safin | Home Page</title>
        <meta name="description" content="Rafał Safin portfolio home page" />
      </Head>
      <Hero>
        <div>
          <Picture
            id="profile-picture"
            src={MeImg}
            alt="My picture"
            style={{ border: "1px solid black" }}
            placeholder="blur"
          />
          <small>Photo by Bogdan Tymoszyk</small>
          <h2>
            Hi, I'm Rafał <br />
            <span>(Polish: ['rafaw])</span>
          </h2>
          <p>
            I am a professional Software Engineer living in Wrocław
            {" <3"}, a beautiful city in Poland. I mostly build things (web
            apps?) using the Python programming language and love cloud based
            infrastructures and CI/CD of all kinds, having experience with
            virtually every provider out there.
          </p>
          <p>
            Why <b>rafsaf</b>? It's a combination of 3 letters of my first and
            last name that I use since primary school, and it sounds a bit funny
            in Polish.
          </p>
        </div>
      </Hero>
      <Skills />
      <TimeLine />
    </>
  );
};

export default index;
