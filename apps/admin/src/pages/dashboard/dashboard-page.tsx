import { Col, Row } from 'antd'
import BannerCard from './banner-card'
import { UserTotal } from './user-total'
import { UserTrend } from './user-trend'

export default function DashboardPage() {
  return (
    <>
      <Row gutter={[16, 16]} justify="center">
        <Col span={24} md={12}>
          <BannerCard />
        </Col>
        <Col span={24} md={12}>
          <UserTotal />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24} md={24}>
          <UserTrend />
        </Col>
      </Row>
    </>
  )
}
