import "croppie/croppie.css";
import "nprogress/nprogress.css";
import "react-html5-camera-photo/build/css/index.css";

import "src/styles/globals.css";
import "src/styles/user.css";

import App from "next/app";
import type { AppProps, AppInitialProps, AppContext } from "next/app";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import NProgress from "nprogress";
import { ReactQueryDevtools } from "react-query-devtools";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import React from "react";

import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Hidden from "@material-ui/core/Hidden";
import { ThemeProvider } from "@material-ui/core/styles";

import { BottomNavBar } from "src/components/BottomNavBar";
import { ScrollTopButton } from "src/components/ScrollTopButton";
import { AdminDrawer } from "src/components/admin/AdminDrawer";
import { TopNavBar } from "src/components/topNavBar";
import { useTranslationContext } from "src/i18n/useTranslation";
import { UserServiceProvider } from "src/services/UserService";
import { ProjectServiceProvider } from "src/services/useProject";
import theme from "src/styles/theme";
import { getInitialData } from "src/util/data";
import type { User } from "types/models/user.type";

interface MyAppOwnProps {
  currentLocale: string;
  locales: { [key: string]: string };
  csrfToken: string | null;
  user: User | null;
}
type MyAppProps = AppProps & MyAppOwnProps;

const queryCache = new QueryCache({
  defaultConfig: {
    queries: {
      staleTime: 3600000, // 1 hour
    },
  },
});

const MyApp: React.FunctionComponent<AppProps> & {
  getInitialProps(appContext: AppContext): Promise<AppInitialProps & { locales: { [key: string]: string } }>;
} = ({ Component, pageProps, router, currentLocale, locales, user, csrfToken }: MyAppProps) => {
  const { t, translationContext } = useTranslationContext(currentLocale, locales);

  const onRouterChangeStart = (): void => {
    NProgress.configure({ showSpinner: false });
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

  const isOnAdmin = router.pathname.slice(1, 6) === "admin";
  let content: React.ReactNode;
  if (isOnAdmin) {
    content = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#eee",
        }}
      >
        <TopNavBar title={"Par Le monde"} homeLink="/create" isOnAdmin />
        <div
          style={{
            backgroundColor: "#eee",
            flex: 1,
            display: "flex",
            height: "100%",
          }}
        >
          <AdminDrawer />
          <main style={{ flex: 1 }}>
            <Container maxWidth="lg">
              <Component {...pageProps} />
            </Container>
          </main>
        </div>
      </div>
    );
  } else {
    content = (
      <ProjectServiceProvider>
        <Hidden smDown implementation="css">
          <TopNavBar title={"Par Le monde"} homeLink="/create" />
        </Hidden>
        <main>
          <Container maxWidth="lg">
            <Component {...pageProps} />
          </Container>
        </main>
        <Hidden mdUp implementation="css">
          <BottomNavBar />
        </Hidden>
      </ProjectServiceProvider>
    );
  }

  return (
    <>
      <Head>
        <title>Par Le Monde{isOnAdmin ? " - Admin" : ""}</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <ReactQueryCacheProvider queryCache={queryCache}>
            <translationContext.Provider value={{ t, currentLocale }}>
              <UserServiceProvider user={user} csrfToken={csrfToken}>
                {content}
              </UserServiceProvider>
            </translationContext.Provider>
            {/* Dev only, it won't appear after build for prod. */}
            <ReactQueryDevtools />
          </ReactQueryCacheProvider>
        </SnackbarProvider>
        <ScrollTopButton />
      </ThemeProvider>
    </>
  );
};

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps & MyAppOwnProps> => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps, ...getInitialData(appContext.ctx) };
};

export default MyApp;
