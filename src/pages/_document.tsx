import { ServerStyleSheets } from "@material-ui/core/styles";
import Document, { Html, Head, Main, NextScript, DocumentInitialProps, DocumentContext } from "next/document";
import React from "react";

// import { User } from "types/entities/user.type";

// interface CustomExpressContext {
//   currentLocale: string;
//   locales: { [key: string]: string };
//   csrfToken: string | null;
//   user: User | null;
// }

// interface MyDocumentProps {
//   data: CustomExpressContext;
// }

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    // const currentLocale = ctx?.req.currentLocale || "fr";
    // const locales = ctx?.req.locales || {};
    // const csrfToken = ctx?.req.csrfToken || null;
    // const user = ctx?.req.user || null;
    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
      // data: {
      //   locales,
      //   csrfToken,
      //   user,
      //   currentLocale,
      // },
    };
  }

  render(): JSX.Element {
    return (
      <Html lang="fr">
        <Head>
          <meta name="theme-color" content="#6065fc" />
          <meta name="description" content="Par Le monde : Application de création de vidéos." />
        </Head>
        <body>
          <noscript>You need to enable JavaScript to run this app.</noscript>
          <Main />
          <NextScript />
          {/* <div id="app-data">{JSON.stringify(this.props.data)}</div> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
