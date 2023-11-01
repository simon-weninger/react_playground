import { StringBuilderContextProvider } from "@src/string-builder/StringBuilderContextNew";
import StringBuilder from "@src/string-builder/StringBuilderNew";
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
        <StringBuilderContextProvider>
          <StringBuilder />
        </StringBuilderContextProvider>
      </div>
    </div>
  );
};

export default Landing;
