import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <script async type="text/javascript" data-api-key={process.env.NEXT_PUBLIC_STAMPEDIO_KEY_PUBLIC} id="stamped-script-widget" src="https://cdn1.stamped.io/files/widget.min.js"></script>
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
