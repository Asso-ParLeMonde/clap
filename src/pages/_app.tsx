import "nprogress/nprogress.css";

import "src/styles/globals.css";
import "src/styles/user.css";

import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import type { AppProps, AppInitialProps, AppContext } from "next/app";
import App from "next/app";
import Head from "next/head";
import NProgress from "nprogress";
import React from "react";

// import type { User } from "server/entities/user";
import { TopNavBar } from "src/components/topNavBar";
import { useTranslationContext } from "src/i18n/useTranslation";
import theme from "src/styles/theme";
import CreateLogo from "src/svg/create.svg";
import SettingsLogo from "src/svg/settings.svg";

const defaultTabs = [
  {
    icon: <CreateLogo />,
    label: "create",
    path: "/create",
  },
  {
    icon: <SettingsLogo />,
    label: "settings",
    path: "/settings",
  },
  {
    icon: <AccountCircleIcon />,
    label: "login",
    path: "/login",
  },
];

interface MyAppOwnProps {
  language: string;
  locales: { [key: string]: string };
  csrfToken: string | null;
  // user: User | null;
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
  const csrfToken = ctxRequest.csrfToken || null;
  // const user = ctxRequest.user || null;
  return { ...appProps, language: "fr", locales, csrfToken };
};

export default MyApp;