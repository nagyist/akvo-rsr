import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SVGInline from 'react-svg-inline'
import { Icon, Button, Dropdown, Menu } from 'antd'
import { useTranslation } from 'react-i18next'

import rsrSvg from './images/akvorsr.svg'

const langs = ['en', 'es', 'fr']
const flags = {}
langs.forEach(lang => {
  flags[lang] = require(`./images/${lang}.png`) // eslint-disable-line
})

const langMenu = ({ userRdr, dispatch }) => {
  const { i18n } = useTranslation()
  useEffect(() => {
    i18n.changeLanguage(userRdr.lang)
  }, [])
  const setLang = (lang) => {
    dispatch({ type: 'SET_LANG', lang })
    i18n.changeLanguage(lang)
  }
  return (
    <Menu className="lang-menu">
      {['en', 'es', 'fr'].filter(it => it !== userRdr.lang).map((lang, index) => (
        <Menu.Item key={index} onClick={() => setLang(lang)}><img src={flags[lang]} /></Menu.Item>
      ))}
    </Menu>
  )
}

const TopBar = ({ userRdr, dispatch }) => {
  const { t } = useTranslation()
  return (
    <div className="top-bar">
      <div className="ui container">
        <a href={`/${userRdr.lang}/projects`}>
        <SVGInline svg={rsrSvg} />
        </a>
        <ul>
          {userRdr.canManageUsers && <li><a href={`/${userRdr.lang}/myrsr/user_management`}>{t('Users')}</a></li>}
          <li><a href={`/${userRdr.lang}/myrsr/iati`}>IATI</a></li>
          <li><a href={`/${userRdr.lang}/myrsr/reports`}>{t('Reports')}</a></li>
        </ul>
        <div className="right-side">
          <Dropdown overlay={langMenu({userRdr, dispatch})} trigger={['click']}>
            <span className="lang"><img src={flags[userRdr.lang]} /></span>
          </Dropdown>
          {userRdr.firstName &&
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                <Menu.Item key="0">
                  <a href="/en/myrsr/details/">{t('My details')}</a>
                </Menu.Item>
                <Menu.Item key="1">
                  <a href="/en/sign_out">{t('Sign out')}</a>
                </Menu.Item>
              </Menu>
            }
          >
            <span className="user ant-dropdown-link">
              {userRdr.firstName} {userRdr.lastName} <Icon type="caret-down" />
            </span>
          </Dropdown>
          }
          <Link to="/projects"><Button type="primary" ghost>{t('My projects')}</Button></Link>
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({ userRdr }) => ({ userRdr })
)(TopBar)