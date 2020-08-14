import React, { useState, useContext } from "react";

import { NextFunctionComponent } from "../../types/next-hook.type";

import { ThemeContext } from "./_app";

const Page: NextFunctionComponent<{ stars: number }> = ({ stars }: { stars: number }) => {
  const theme = useContext(ThemeContext);
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{theme}</p>
      <p>Stars: {stars}</p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
};

Page.getInitialProps = async () => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};

export default Page;
