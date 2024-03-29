import { AppVariables } from "lwt-build";
import {
  A,
  FloatingMenu,
  FooterInfo,
  InfoLine,
  useInternalNavigate,
  useSmoothScrollOnHashChange,
} from "lwt-ui-kit";
// import { PLUGINS } from "../plugins";

// TODO formalize objs so these also act as docs?
const infoLines: Parameters<typeof InfoLine>[0][] = [
  { title: "Preface", href: "preface" },
  { title: "New Features", href: "features" },
  { title: "Plugins", href: "plugins" },
  { title: "Persistence Strategies", href: "persist" },
  { title: "Project Info", href: "info" },
  { title: "Current Version", href: "current" },
  { title: "Change Log", href: "changelog" },
];

export function LWTReactInfo() {
  const navigator = useInternalNavigate();
  useSmoothScrollOnHashChange();
  return (
    <body>
      <FloatingMenu menuOptions={infoLines} />

      <div style={{ marginRight: "100px" }}>
        <h4>
          <A href="/" target="_top">
            <img
              style={{ width: "175px", height: "175px" }}
              src="img/lwt_icon.svg"
              className="lwtlogoright"
              alt="Logo"
            />
            Learning with Texts React Port
          </A>
          <br />
          <br />
          <span className="bigger">Port Information</span>
          <br />
        </h4>
        <b>
          Note! This page is not meant as an introduction for how to use LWT!
        </b>{" "}
        Check out <A href="/info">the normal info page</A> for more of an
        explanation on how to use this app
        <br />
        <p className="inline">
          Jump to topic:
          <select
            id="topicjump"
            onChange={({ target: { value } }) => {
              if (value !== "-1") {
                // TODO no any, make option values typed & plugin route work
                navigator(("#" + value) as any, true);
              }
            }}
          >
            <option value="-1" selected>
              [Select...]
            </option>
            {infoLines.map((line) => (
              <option value={line.href}>{line.title}</option>
            ))}
          </select>
        </p>
        <dl>
          {/* <!-- ================================================================ --> */}

          {/* TODO dont like numbers here  */}
          <InfoLine {...infoLines[0]} />

          <dd>
            <ul>
              <li>
                This application was created meant as both a tribute to the
                original author of LWT ("lang-learn-guy" on sourceforge) whose
                software has served me well for over a decade now.
              </li>
              <li>
                It was written not only as a personal & portfolio project, but
                also as a jumping-off point for radical further extension of the
                project & spirit of LWT.
              </li>

              <li>
                However, I also wanted to have the interface remain familiar to
                those already using LWT. Therefore I opted for a
                reimplimentation using React with a plugin-able structure to
                allow for maximal customization & utility.
              </li>

              <li>
                A major pattern this project aims for is a strong separation of
                concern between data & display, in doing so this allows
                flexibility in configuration & direct integration into wider
                workflow pipelines.
              </li>

              <li>
                One major complaint I'd seen about LWT was the difficulty in
                setting up a LAMP (or heaven forbid - WAMP) stack for non-coding
                language-learning enthusiasts. In order to address this.
                LWT-React was built with multiple configurable backends in mind
                - particularly of note are local storage backends. (if you're
                reading this from a demo site, you're likely using a local
                storage backend for your data right now!)
              </li>

              <li>
                Additionally - LWT-React has an Electron buld target, and if
                built in Electron has (mostly-integrated) support for a{" "}
                <b>*full*</b> SQLite backend, contained within Electron. This
                should allow for simple creation of a completely self-contained
                local mobile application.
              </li>

              <li>
                Since Glosbe API has now been deprecated, LWT-React has
                abstracted that interface to allow for any api-based translation
                engine. Tatoeba is free and doesn't require an account, so
                that's the default demo example. In order to activate an API,
                set a dict value to the template string "api://API_PLUGIN_NAME"
                where API_PLUGIN_NAME is the name of an installed plugin. You
                will likely have to input a key in the language settings. An
                OpenAPI-compatible API is much easier to integrate
              </li>

              <li>
                A piece of software will be never completely free of "bugs" -
                please inform me of any problem you will encounter. Your
                feedback and ideas are always welcome.
              </li>

              <li>
                Thank you for your attention. I hope you will enjoy this
                application as I do every day.
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          {/* {<InfoLine {...infoLines[1]} />} */}

          {/* <!-- ================================================================ --> */}

          {<InfoLine {...infoLines[2]} />}

          <dd>
            <ul>
              <li>
                The plugin structure is currently only preliminarily integrated,
                but most functional differences from the original LWT are/will
                be relegated to here. This info page is actually a (simple)
                plugin!
              </li>
              <li>
                Plugins are installed during compile time by adding an object
                matching the provided structure in the `plugins.ts` file.
              </li>
              <li>
                A build flag is available to disable all plugins in case that is
                causing system instabililty - `
                <b>VITE_LWT_DISABLE_PLUGINS=true</b>`
              </li>
              <li>
                {/* TODO maybe consider just having a catchall "CUSTOM" table for sql backends */}
                Plugins also can have impacts on backend data structs, such as
                adding a new column to a table.
              </li>
              {/* <li>
                Currently Installed Plugins:{" "}
                {PLUGINS[0] ? (
                  <ul>
                    {PLUGINS.map((val) => (
                      <li>{val.pluginName}</li>
                    ))}
                  </ul>
                ) : (
                  " None!"
                )}
              </li> */}
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}

          {<InfoLine {...infoLines[3]} />}

          <dd>
            <ul>
              <li>
                Persistence Strategies are how data changes continue to exist
                upon page reload. Since this project is mostly frontend-driven,
                I wanted to minimize the relevance of persistence implementation
                details.
              </li>
              <li>
                Currently Supported Strategies:
                <br />
                <ul>
                  <li>localStorage</li>
                  <li>SQLite (if using Electron)</li>
                  <li>REST (coming soon!)</li>
                </ul>
              </li>
              <li>
                Currently `localStorage` strategy is the default, meaning all
                data is saved in the localStorage of the browser. Using the
                localStorage strategy, no data gets persisted about the user on
                the webserver (other than origin url of page reloads)
              </li>
              <li>
                If your local storage data is breaking the app, then you can
                always go into the developer console & empty your localstorage
                for this site! This is the equivalent of wiping the DB &
                starting over
              </li>
              <li>
                Choice of Persistence Strategy is set on build, by use of the{" "}
                <b>VITE_LWT_PERSIST</b> build flag
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}
          {<InfoLine {...infoLines[4]} />}

          <dd>
            <ul>
              <li>
                <a
                  href={AppVariables.frontendSource}
                  target="_blank"
                  rel="noreferrer"
                >
                  <b>Project Page</b> @ Github
                </a>
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}
          {<InfoLine {...infoLines[5]} />}

          <dd>
            <ul>
              <li>
                The current version is <b>{AppVariables.frontendVersion}</b> (
                {AppVariables.releaseDate}).
              </li>

              <li>
                <a href="#changelog">View the Changelog.</a>
              </li>
            </ul>
          </dd>
          {/* <!-- ================================================================ --> */}
          {<InfoLine {...infoLines[6]} />}

          <dd>
            <ul>
              <li>
                {AppVariables.frontendVersion} ({AppVariables.releaseDate}):
                <br />
                <ul>
                  <li>Initial Rolling Demo Release</li>
                </ul>
                <br />
                <br />
              </li>
            </ul>
          </dd>

          {/* <!-- ================================================================ --> */}
        </dl>
        <FooterInfo />
      </div>
    </body>
  );
}
