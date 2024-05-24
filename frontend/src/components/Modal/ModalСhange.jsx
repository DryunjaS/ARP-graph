import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"

function ModalChange({ show, setShow, currentNode, updateNodeImage }) {
	const [hardware, setHardware] = useState("")
	const [current, setCurrent] = useState("")

	useEffect(() => {
		if (currentNode) {
			if (currentNode.imgUrl === "/images/pc.png") {
				setCurrent("Компьютер")
			} else if (currentNode.imgUrl === "/images/router.png") {
				setCurrent("Маршрутизатор")
			} else if (currentNode.imgUrl === "/images/switch.png") {
				setCurrent("Коммутатор")
			}
		}
	}, [currentNode])

	const handleClose = () => setShow(false)

	const handleSave = () => {
		if (hardware) {
			let newImgUrl = ""
			if (hardware === "Компьютер") {
				newImgUrl = "/images/pc.png"
			} else if (hardware === "Маршрутизатор") {
				newImgUrl = "/images/router.png"
			} else if (hardware === "Коммутатор") {
				newImgUrl = "/images/switch.png"
			}
			updateNodeImage(newImgUrl)
		}
		handleClose()
	}

	const changeHardware = (event) => {
		setHardware(event.target.value)
	}

	return (
		<div
			className='modal show'
			style={{ display: "block", position: "initial" }}
		>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Изменение типа оборудования</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='modal-wrapp'>
						{current && (
							<h6 className='modal-block'>Текущий элемент: {current}</h6>
						)}
						<Form.Select onChange={changeHardware} value={hardware}>
							<option value=''>Выберите тип оборудования</option>
							<option value='Маршрутизатор'>Маршрутизатор</option>
							<option value='Коммутатор'>Коммутатор</option>
							<option value='Компьютер'>Компьютер</option>
						</Form.Select>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='secondary' onClick={handleClose}>
						Отмена
					</Button>
					<Button variant='primary' onClick={handleSave}>
						Сохранить изменения
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default ModalChange
