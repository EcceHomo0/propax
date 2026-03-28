import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the home search button", async () => {
  render(<App />);

  expect(await screen.findByRole("button", { name: /rechercher/i })).toBeInTheDocument();
});
