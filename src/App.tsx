import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tool from "./defaultOverrideValues/Tool";
import FastContext from "./pages/FastContext";
import Landing from "./pages/Landing";
import { ActiveStringBuilderIdContextProvider } from "./string-builder/ActiveStringBuilderContext";
import StringBuilderClass from "./string-builder/class-impl/StringBuilderClass";
import { StringBuilderContextClassProvider } from "./string-builder/class-impl/StringBuilderContextClass";
import PixelBuilder from "./string-builder/obj-impl/PixelBuilder";
import { PixelBuilderContextProvider } from "./string-builder/obj-impl/PixelBuilderContext";
import { generateId } from "./string-builder/utils";

export const router = createBrowserRouter([
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
          <ActiveStringBuilderIdContextProvider>
            <PixelBuilderContextProvider>
              <PixelBuilder id={generateId()} />
            </PixelBuilderContextProvider>
            <br />
            <br />
            <br />
            <br />
            <PixelBuilderContextProvider>
              <PixelBuilder id={generateId()} />
            </PixelBuilderContextProvider>
          </ActiveStringBuilderIdContextProvider>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
