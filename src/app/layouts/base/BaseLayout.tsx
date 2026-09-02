import { Outlet } from '@tanstack/react-router'
import { Container, Content } from 'rsuite'

import { Footer, Header } from '../parts'
import './BaseLayout.css'

/**
 * Основной лейаут на Container из RSuite: шапка, контент, подвал.
 * Container уже задаёт flex-колонку и min-height, поэтому своей вёрстки
 * тут почти не осталось — только ограничение ширины контента.
 */
export function BaseLayout() {
  return (
    <Container className="app">
      <Header />

      <Content className="main">
        <Outlet />
      </Content>

      <Footer />
    </Container>
  )
}
