import { Lato, Roboto_Mono } from "next/font/google";

export const lato = Lato({
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin-ext"],
  preload: true,
});
export const roboto_mono = Roboto_Mono({
  weight: ["300", "400"],
  display: "swap",
  subsets: ["latin-ext"],
  preload: true,
});

export const setColor = {
  primaryColor: "#0fe1fa",
  primaryColor2: "#2793a0",
  primaryColor3: "#0b7380",
  mainWhite: "#fff",
  light: "rgb(218, 216, 216)",
  mainBlack: "#272727",
  orange: "#d74c2f",
  mainGrey: "#719da0",
  blue: "rgb(60, 107, 170)",
  mainGreen: "#35eb44",
  serviceLiveBg: "#DFF2BF",
  serviceLiveText: "#366800",
  serviceDeadBg: "#FFD2D2",
  serviceDeadText: "#D8000C",
};

export const setFont = {
  main: `font-family: ${lato.style.fontFamily}, sans-serif;`,
  roboto: `font-family: ${roboto_mono.style.fontFamily}, monospace;`,
};
