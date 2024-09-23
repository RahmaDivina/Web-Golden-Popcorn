import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../../components/Sidebar';

const DashboardPage = () => {
    return (
        <Container fluid className="mt-3">
          <Row>
            {/* Sidebar */}
            <Col md={2}>
              <Sidebar />
            </Col>
            </Row>
    </Container>
  );
};

export default DashboardPage;
