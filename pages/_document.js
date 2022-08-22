import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
          <script async type="text/javascript" src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=PX38fc"></script>
        </body>
      </Html>
    )
  }
}

export default MyDocument
