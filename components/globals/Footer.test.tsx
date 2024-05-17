import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "./Footer";

test("footer matches snapshot", () => {
  const tree = render(<Footer />);

  expect(tree).toMatchSnapshot("f1");
});

test("footer have contact, email and source code link", () => {
  render(<Footer />);

  expect(screen.getByRole("heading")).toHaveTextContent("Contact");
  expect(screen.findByDisplayValue("rafal.safin@rafsaf.pl")).toBeDefined();
  expect(screen.findByDisplayValue("source code")).toBeDefined();
});
