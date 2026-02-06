import type { ReactNode } from 'react'
import './Modal.css'

type ModalProps = {
  title: string
  children: ReactNode
  actions: ReactNode
}

function Modal({ title, children, actions }: ModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-content">{children}</div>
        <div className="modal-actions">{actions}</div>
      </div>
    </div>
  )
}

export default Modal
