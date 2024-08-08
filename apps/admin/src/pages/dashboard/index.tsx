import { Col, Row } from 'antd'
import { UserTrend } from './user-trend'
import { UserTotal } from './user-total'

export default function Page() {
  return (
    <Row gutter={[16, 16]} className="mt-4" justify="center">
      <Col span={24} md={16}>
        <UserTrend />
      </Col>

      <Col span={24} md={8}>
        <UserTotal />
      </Col>
    </Row>
  )
}
