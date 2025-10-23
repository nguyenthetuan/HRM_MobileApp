import React, { useEffect } from 'react'
import modalManager from './ModalManager'

const ModalContainer = () => {
  const [isVisible, setVisible] = React.useState(false)
  const CurrentModal = modalManager.getCurrentModal()
  const currentModalProps = modalManager.getCurrentModalProps()

  currentModalProps.visible = isVisible
  currentModalProps.onDismiss = () => modalManager.handleModalDismiss()

  return <CurrentModal {...currentModalProps} />
}

export default ModalContainer
