/* globals localStorage */
import React, { useEffect } from 'react'
import { Modal, Form, Button, Row, Col } from 'antd'
import { Form as FinalForm, Field, FormSpy } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import arrayMutators from 'final-form-arrays'
import { useTranslation } from 'react-i18next'
import InputLabel from '../../../../utils/input-label'
import FinalField from '../../../../utils/final-field'

const { Item } = Form

const handleUpdate = (props) => {
  useEffect(() => {
    localStorage.setItem(`rsr-default-periods-p${props.projectId}`, JSON.stringify(props.values.periods))
    props.setDefaultPeriods(props.values.periods)
  }, [props.values.periods])
  return null
}

// class UpdateHandler = () =>

const DefaultsModal = ({ visible, setVisible, projectId, setDefaultPeriods, defaultPeriods }) => {
  const { t } = useTranslation()
  return (
    <Modal visible={visible} onCancel={() => setVisible(false)} footer={null}>
      <Form layout="vertical">
      <FinalForm
        onSubmit={() => {}}
        subscription={{}}
        initialValues={{ periods: defaultPeriods }}
        mutators={{ ...arrayMutators }}
        render={({
          form: {
            mutators: { push, pop }
          }
        }) => (
          <div>
            <FieldArray name="periods" subscription={{}}>
              {({ fields }) => (
                <div>
                  {fields.length === 0 && (
                    <div>
                      <h5>No default periods set yet.</h5>
                      <p>If you setup default periods, they will automatically be added to new indicators</p>
                    </div>
                  )}
                  {fields.map((name, index) => (
                    <Row gutter={16}>
                      <Col span={12}>
                        <Item label={<InputLabel>{t('Period')} {index + 1} {t('from')}</InputLabel>}>
                          <FinalField name={`${name}.periodStart`} control="datepicker" />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label={<InputLabel>{t('to')}</InputLabel>}>
                          <FinalField name={`${name}.periodEnd`} control="datepicker" />
                        </Item>
                      </Col>
                    </Row>
                  ))}
                  <div>
                    <Button type="link" icon="plus" onClick={() => push('periods', {})}>{t('Add period')}</Button>
                    {fields.length > 0 && (
                      <Button type="link" icon="minus" onClick={() => pop('periods')}>{t('Remove period')}</Button>
                    )}
                  </div>
                </div>
              )}
            </FieldArray>
            <FormSpy
              subscription={{ values: true }}
              component={handleUpdate}
              projectId={projectId}
              setDefaultPeriods={setDefaultPeriods}
            />
          </div>
        )}
      />
      </Form>
    </Modal>
  )
}

export default DefaultsModal
