import React, { useEffect, useState, useRef } from 'react'
import { Button, Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { css, jsx } from '@emotion/core'
import api from '../../utils/api'


const AssignmentView = ({ id, selectedIndicators, setSelectedIndicators, enumerators, setEnumerators }) => {
  const { t } = useTranslation()
  const [selectedEnumerators, setSelectedEnumerators] = useState([])
  const assignedEnumerators = enumerators.filter(enumerator => {
    return selectedIndicators.filter(indicatorId => enumerator.indicators.indexOf(indicatorId) !== -1).length > 0
  })
  const handleAssign = () => {
    const _enumerators = enumerators.map(it => ({ ...it }))
    const payload = selectedEnumerators.map(email => {
      const enumerator = _enumerators.find(it => it.email === email)
      enumerator.indicators = [...enumerator.indicators, ...selectedIndicators]
      return ({ email, indicators: [...enumerator.indicators, ...selectedIndicators] })
    })
    api.patch(`/project/${id}/enumerators/`, payload)
    setEnumerators(_enumerators)
    setSelectedEnumerators([])
    // payload.forEach(enumerator => {
    //   _enumerators.find(it)
    // })
  }
  return [
    <div className="assignment view">
      <header>
        <Button size="small" icon="arrow-left" onClick={() => setSelectedIndicators([])}>Full list</Button>
        Indicator Assignment
      </header>
      <div css={css`display: flex; flex-direction:column; padding: 15px;`}>
        <h5>{t('Add enumerators to {{indicators}} indicators', { indicators: selectedIndicators.length })}</h5>
        <div css={css`display: flex; margin: 5px 0`}>
          <Select value={selectedEnumerators} onChange={setSelectedEnumerators} mode="multiple" placeholder="+ Select enumerator" allowClear css={css`flex: 1`}>
            {enumerators.map(enumerator => <Select.Option key={enumerator.email}>{enumerator.name}</Select.Option>)}
          </Select>
          <Button onClick={handleAssign} disabled={selectedEnumerators.length === 0} css={css`margin-left: 5px`}>Assign</Button>
        </div>
        {/* <p>{selectedIndicators.length} selected indicators</p>
                  <div css={css`margin-left: auto`}>
                    <Button icon="plus" type="primary">Assign enumerator</Button>
                  </div> */}
      </div>
      {assignedEnumerators.length > 0 &&
        <div css={css`
          display: flex; padding: 5px 15px;
          .ant-btn{
            margin-left: auto;
          }
        `
        }>
          <h5 css={css`margin-top: 5px`}>{assignedEnumerators.length} assigned enumerators</h5>
          {assignedEnumerators.length > 1 && <Button>Unassign all</Button>}
        </div>
      }
      <ul className="assigned-enumerators">
        {enumerators.sort((a, b) => b.indicators.length - a.indicators.length).map(enumerator => {
          const assigned2enumerator = selectedIndicators.filter(indicatorId => enumerator.indicators.indexOf(indicatorId) !== -1)
          if (assigned2enumerator.length === 0) return null
          // const selectedUnassigned = selectedIndicators.filter(indicatorId => enumerator.indicators.indexOf(indicatorId) === -1)
          // if(selectedUnassigned.length > 0) return null
          return [
            <li css={css`display: flex`}>
              <div>
                <h6>{enumerator.name}</h6>
                <span>Akvo foundation</span>
              </div>
              <Button>Unassign</Button>
            </li>
          ]
        })}
      </ul>
    </div>
  ]
}

export default AssignmentView
