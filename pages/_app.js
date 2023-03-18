import '@styles/globals.css'

function Application({ Component, pageProps }) {
  return (
    <html>
      <head>
        <meta http-equiv="Access-Control-Allow-Origin" content="https://www.httnews.com/generator" />
      </head>
      <body>
        <Component {...pageProps} />
      </body>
    </html>
  )
}

export default Application
