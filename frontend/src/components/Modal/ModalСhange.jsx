import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"

function ModalChange({ show, setShow, currentNode, updateNodeImage }) {
	const [hardware, setHardware] = useState("")
	const [current, setCurrent] = useState("")

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
				// Добавляем дополнительные случаи
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

	const handleClose = () => setShow(false)

	const handleSave = () => {
		if (hardware) {
			let newImgUrl = ""
			switch (hardware) {
				case "Компьютер":
					newImgUrl = "/images/pc.png"
					break
				case "Маршрутизатор":
					newImgUrl = "/images/router.png"
					break
				case "Коммутатор":
					newImgUrl = "/images/switch.png"
					break
				case "Концентратор":
					newImgUrl = "/images/hub.png"
					break
				case "Ноутбук":
					newImgUrl = "/images/laptop.png"
					break
				case "Принтер":
					newImgUrl = "/images/printer.png"
					break
				case "Сеть":
					newImgUrl = "/images/network.png"
					break
				case "Сервер":
					newImgUrl = "/images/server.png"
					break
				case "Коммутатор 3 ур.":
					newImgUrl = "/images/L3.png"
					break
				case "Телефон":
					newImgUrl = "/images/phone.png"
					break
				default:
					newImgUrl = ""
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
							{/* Добавляем остальные варианты */}
							<option value='Концентратор'>Концентратор</option>
							<option value='Ноутбук'>Ноутбук</option>
							<option value='Принтер'>Принтер</option>
							<option value='Сеть'>Сеть</option>
							<option value='Сервер'>Сервер</option>
							<option value='Коммутатор 3 ур.'>Коммутатор 3 ур.</option>
							<option value='Телефон'>Телефон</option>
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
