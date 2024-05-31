import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

const ModalDelete = ({ show, setShow, currentNode, onDelete }) => {
	const [current, setCurrent] = useState("")

	const handleClose = () => setShow(false)
	const handleDelete = () => {
		onDelete(currentNode)
		handleClose()
	}
	useEffect(() => {
		if (currentNode) {
			switch (currentNode.imgUrl) {
				case "/images/pc.png":
					setCurrent("Компьютер")
					break
				case "/images/router.png":
					setCurrent("Маршрутизатор")
					break
				case "/images/switch.png":
					setCurrent("Коммутатор")
					break
				case "/images/hub.png":
					setCurrent("Концентратор")
					break
				case "/images/laptop.png":
					setCurrent("Ноутбук")
					break
				case "/images/printer.png":
					setCurrent("Принтер")
					break
				case "/images/network.png":
					setCurrent("Сеть")
					break
				case "/images/server.png":
					setCurrent("Сервер")
					break
				case "/images/L3.png":
					setCurrent("Коммутатор 3 ур.")
					break
				case "/images/phone.png":
					setCurrent("Телефон")
					break
				default:
					setCurrent("")
			}
		}
	}, [currentNode])
	return (
		<div
			className='modal show'
			style={{ display: "block", position: "initial" }}
		>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Предупреждение!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='modal-wrapp'>
						Вы действительно хотите удалить этот {current}?
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Отмена
					</Button>
					<Button variant='danger' onClick={handleDelete}>
						Удалить
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default ModalDelete
