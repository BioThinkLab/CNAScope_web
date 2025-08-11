import "@/styles/globals.css";
import { StyleProvider } from "@ant-design/cssinjs"
import { ConfigProvider } from "antd"
import theme from '/theme/theme'
import Head from "next/head"
import CNAScopeLayout from "@/components/layouts/global/CNAScopeLayout"

export default function App({ Component, pageProps }) {
  return (
      <StyleProvider layer>
        <ConfigProvider theme={theme}>
          <Head>
            <title>CNAScope</title>
            <meta name="description" content="CNAScope"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/CNAScope_icon.svg"/>
          </Head>
          <CNAScopeLayout>
            <Component {...pageProps} />
          </CNAScopeLayout>
        </ConfigProvider>
      </StyleProvider>
  )
}
