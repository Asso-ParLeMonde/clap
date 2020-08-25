import "nprogress/nprogress.css";

import "src/styles/globals.css";
import "src/styles/user.css";

import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, Container, Hidden } from "@material-ui/core";
import type { AppProps, AppInitialProps, AppContext } from "next/app";
import App from "next/app";
import Head from "next/head";
import NProgress from "nprogress";
import React from "react";

import { TopNavBar } from "src/components/topNavBar";
import { useTranslationContext } from "src/i18n/useTranslation";
import { UserServiceProvider } from "src/services/UserService";
import theme from "src/styles/theme";
import { User } from "types/user.type";

interface MyAppOwnProps {
  currentLocale: string;
  locales: { [key: string]: string };
  csrfToken: string | null;
  user: User | null;
}
type MyAppProps = AppProps & MyAppOwnProps;

const MyApp: React.FunctionComponent<AppProps> & {
  getInitialProps(appContext: AppContext): Promise<AppInitialProps & { locales: { [key: string]: string } }>;
} = ({ Component, pageProps, router, currentLocale, locales, user }: MyAppProps) => {
  const { t, translationContext } = useTranslationContext(currentLocale, locales);

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
        <translationContext.Provider value={{ t, currentLocale }}>
          <UserServiceProvider user={user}>
            <Hidden smDown>
              <TopNavBar title={"Par Le monde"} homeLink="/create" currentPath={router.pathname} />
            </Hidden>
            <main>
              <Container maxWidth="lg">
                <Component {...pageProps} />
              </Container>
            </main>
          </UserServiceProvider>
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
  const currentLocale = ctxRequest.currentLocale || "fr";
  const locales = ctxRequest.locales || {};
  const csrfToken = ctxRequest.csrfToken || null;
  const user = ctxRequest.user || null;
  return { ...appProps, locales, csrfToken, user, currentLocale };
};

export default MyApp;
