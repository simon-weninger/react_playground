import { ActiveStringBuilderIdContextProvider } from "@src/string-builder/ActiveStringBuilderContext";
import PixelBuilder from "@src/string-builder/obj-impl/PixelBuilder";
import { PixelBuilderContextProvider } from "@src/string-builder/obj-impl/PixelBuilderContext";
import Placeholder from "@src/string-builder/obj-impl/elements/placeholder-context/PlaceholderContext";
import { generateId } from "@src/string-builder/utils";
import { Outlet } from "react-router-dom";
import { router } from "../App";

const Landing = (): JSX.Element => {
  return (
    <div className="flex">
      <div id="sidebar">
        <nav>
          <ul className="m-4">
            {router.routes[0].children?.map((route) => (
              <li key={route.path} className="text-blue-700">
                <a href={`${route.path}`}>{route.path}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div id="detail" className="flex-1">
        <Placeholder.root>
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
          <Outlet />
        </Placeholder.root>
      </div>
    </div>
  );
};

export default Landing;
