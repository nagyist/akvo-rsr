import React from 'react'
import { Collapse, Icon, Spin } from 'antd'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useFetch } from '../../utils/hooks'
import Indicator from './indicator'

const { Panel } = Collapse
const ExpandIcon = ({ isActive }) => (
  <div className={classNames('expander', { isActive })}>
    <Icon type="down" />
  </div>
)
const Aux = node => node.children

const Result = ({ programId, id }) => {
  const { t } = useTranslation()
  const [result, loading] = useFetch(`/project/${programId}/result/${id}/`)
  return (
    <Aux>
      {loading && <div className="loading-container"><Spin indicator={<Icon type="loading" style={{ fontSize: 32 }} spin />} /></div>}
      {!loading &&
      <Collapse defaultActiveKey={result.indicators.map(it => it.id)} expandIcon={({ isActive }) => <ExpandIcon isActive={isActive} />}>
      {result.indicators.map(indicator =>
        <Panel
          key={indicator.id}
          header={
            <div>
              <h3>{indicator.title}</h3>
              <div><span className="type">{indicator.type}</span> <span className="periods">{t('nperiods', { count: indicator.periodCount })}</span></div>
            </div>}
          destroyInactivePanel
        >
          <Indicator periods={indicator.periods} indicatorType={indicator.type} />
        </Panel>
      )}
      </Collapse>
      }
    </Aux>
  )
}

export default Result