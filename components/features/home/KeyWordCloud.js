import dynamic from 'next/dynamic'

const KeywordCloud = dynamic(() =>
        Promise.resolve(() => (
            <iframe
                src="/html/cloudTag.html"
                style={{
                    width: '480px',
                    height: '480px',
                    border: 'none',
                    overflow: 'hidden',
                    background: 'transparent',
                }}
                title="3D Tag Cloud"
            />
        )),
    { ssr: false } // 禁用 SSR
)

export default KeywordCloud
