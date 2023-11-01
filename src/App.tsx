import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FastContext from "./pages/FastContext";
import Landing from "./pages/Landing";
import Tool from "./defaultOverrideValues/Tool";
import StringBuilder from "./string-builder/StringBuilderNew";
import { StringBuilderContextProvider } from "./string-builder/StringBuilderContextNew";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Landing />,
      children: [
        {
          path: "fast-context",
          element: <FastContext />,
        },
        {
          path: "tool",
          element: <Tool />,
        },
        {
          path: "stringbuilder",
          element: (
            <>
              <StringBuilderContextProvider>
                <StringBuilder />
              </StringBuilderContextProvider>
              <br />
              <br />
              <br />
              <br />
              <StringBuilderContextProvider>
                <StringBuilder />
              </StringBuilderContextProvider>
              <br />
              <br />
              <br />
              <br />
              <StringBuilderContextProvider>
                <StringBuilder />
              </StringBuilderContextProvider>
            </>
          ),
        },
      ],
    },
  ],
  { basename: "/react_playground" }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
