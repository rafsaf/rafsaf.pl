import React from "react";
import Head from "next/head";
import Hero from "../components/globals/Hero";
import Skills from "../components/index/skills";
import TimeLine from "../components/index/timeline";
import Image from "next/image";
import MeImg from "../public/me.webp";

const index = () => {
  return (
    <>
      <Head>
        <title>Rafał Safin | Home Page</title>
        <meta name="description" content="Rafał Safin portfolio home page" />
      </Head>
      <Hero>
        <div>
          <Image
            id="profile-picture"
            src={MeImg}
            alt="My picture"
            placeholder="blur"
          />
          <h2>
            Hi, I'm Rafał <br />
            <span>(Polish: ['rafaw])</span>
          </h2>
          <p>
            I am professional Software Engineer living in Wrocław
            {" <3"}, the beautiful city in Poland. I mostly build things (web
            apps?) using the Python programming language and love cloud based
            infrastrucures and CI/CD of all kinds, having an experience with
            virtually every provider out there.
          </p>
        </div>
      </Hero>
      <Skills />
      <TimeLine />
    </>
  );
};

export default index;
