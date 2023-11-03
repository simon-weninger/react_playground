import { StringBuilderContextClassProvider } from "@src/string-builder/class-impl/StringBuilderContextClass";
import StringBuilder from "@src/string-builder/StringBuilderNew";
import { router } from "../App";
import { Outlet } from "react-router-dom";

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
        <Outlet />
      </div>
    </div>
  );
};

export default Landing;
