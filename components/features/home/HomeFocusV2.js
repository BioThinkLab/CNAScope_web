import { Box } from "@mui/system"
import { Typography } from "antd"
import Slider from 'react-slick'

const { Title } = Typography

const Carousel = ({}) => {
    // 配置轮播图参数
    const settings = {
        dots: true, // 显示分页点
        infinite: true, // 无限滚动
        speed: 500, // 滚动速度
        slidesToShow: 1, // 每次显示一个幻灯片
        slidesToScroll: 1, // 每次滚动一个幻灯片
        autoplay: true, // 自动播放
        autoplaySpeed: 3000, // 每个幻灯片的停留时间
    };

    return (
        <div style={{ width: '80%', margin: '0 auto' }}>
            <Slider {...settings}>
                <div>
                    <img src="/CNAScope-Figure1.svg" alt="Slide 2" style={{ width: '100%', height: 'auto' }}  />
                </div>
                <div>
                    <img src="/CNAScope-Figure2.svg" alt="Slide 3" style={{ width: '100%', height: 'auto' }}  />
                </div>
            </Slider>
        </div>
    );
};

const HomeFocus = () => (
    <Box sx={{ mt: 2, mb: 2 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            Focus
        </Title>
        <Carousel/>
    </Box>
)

export default HomeFocus
