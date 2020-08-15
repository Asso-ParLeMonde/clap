import "nprogress/nprogress.css";

import "../styles/globals.css";

import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import React from "react";

import { TopNavBar } from "src/frontend/components/TopNavBar";
import theme from "src/frontend/util/theme";

const defaultTabs = [
  {
    label: "create",
    path: "/create",
    // icon: <CreateLogo />,
  },
  {
    label: "settings",
    path: "/settings",
    // icon: <SettingsLogo />,
  },
  {
    label: "login",
    path: "/login",
    // icon: <AccountCircleIcon />,
  },
];

const MyApp: React.FunctionComponent<AppProps> = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [path, setPath] = React.useState<string>("/");

  const onRouterChangeStart = (): void => {
    NProgress.start();
  };
  const onRouterChangeComplete = (): void => {
    setTimeout(() => {
      NProgress.done();
    }, 200);
    setPath(window.location.pathname);
  };
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // get current route
    setPath(window.location.pathname);
    router.events.on("routeChangeStart", onRouterChangeStart);
    router.events.on("routeChangeComplete", onRouterChangeComplete);
    router.events.on("routeChangeError", onRouterChangeComplete);
    return () => {
      router.events.off("routeChangeStart", onRouterChangeStart);
      router.events.off("routeChangeComplete", onRouterChangeComplete);
      router.events.off("routeChangeError", onRouterChangeComplete);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <title>Par Le Monde</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopNavBar title={"Par Le monde"} tabs={defaultTabs} homeLink="/create" currentPath={path} />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
// MyApp.getInitialProps = async (appContext: AppContext): Promise<MyAppProps> => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps, route: appContext.router.route } as MyAppProps;
// };

export default MyApp;
