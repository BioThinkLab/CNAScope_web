import { MessageContext } from "@/context/MessageContext"
import { Layout, message } from "antd"
import CNAScopeHeader from "@/components/layouts/global/CNAScopeHeader"
import CNAScopeContent from "@/components/layouts/global/CNAScopeContent"
import CNAScopeFooter from "@/components/layouts/global/CNAScopeFooter"
import BrowserAlert from "@/components/common/alert/BrowserAlert"

const CNAScopeLayout = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage()

    return (
        <MessageContext.Provider value={messageApi}>
            <Layout>
                <CNAScopeHeader/>
                <CNAScopeContent>
                    {contextHolder}
                    {children}
                </CNAScopeContent>
                <CNAScopeFooter/>
                <BrowserAlert/>
            </Layout>
        </MessageContext.Provider>
    )
}

export default CNAScopeLayout
