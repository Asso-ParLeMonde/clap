import "nprogress/nprogress.css";

import "src/frontend/components/create/ThemeCard.css";
import "src/frontend/styles/create.css";
import "src/frontend/styles/globals.css";

import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import type { AppProps, AppInitialProps, AppContext } from "next/app";
import App from "next/app";
import Head from "next/head";
import NProgress from "nprogress";
import React from "react";

import { TopNavBar } from "src/frontend/components/TopNavBar";
import { useTranslationContext } from "src/frontend/i18n/useTranslation";
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

interface MyAppOwnProps {
  language: string;
  locales: { [key: string]: string };
}
type MyAppProps = AppProps & MyAppOwnProps;

const MyApp: React.FunctionComponent<AppProps> & {
  getInitialProps(appContext: AppContext): Promise<AppInitialProps & { locales: { [key: string]: string } }>;
} = ({ Component, pageProps, router, language, locales }: MyAppProps) => {
  const { t, translationContext } = useTranslationContext(language, locales);

  const onRouterChangeStart = (): void => {
    NProgress.start();
  };
  const onRouterChangeComplete = (): void => {
    setTimeout(() => {
      NProgress.done();
    }, 200);
  };
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // get current route
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
        <translationContext.Provider value={t}>
          <TopNavBar title={"Par Le monde"} tabs={defaultTabs} homeLink="/create" currentPath={router.pathname} />
          <Component {...pageProps} />
        </translationContext.Provider>
      </ThemeProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps & MyAppOwnProps> => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ctxRequest: any = appContext.ctx.req || {};
  const locales = ctxRequest.locales || {};
  return { ...appProps, language: "fr", locales };
};

export default MyApp;
