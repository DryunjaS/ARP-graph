import React, { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"

function ModalChange({
	show,
	setShow,
	currentNode,
	updateNodeImage,
	nameNodes,
	updateNodeNameByIp,
}) {
	const [hardware, setHardware] = useState("")
	const [current, setCurrent] = useState("")
	const [nameNode, setNameNode] = useState()

	useEffect(() => {
		if (currentNode) {
			switch (currentNode.imgUrl) {
				case "./images/pc.png":
					setCurrent("Компьютер")
					break
				case "./images/router.png":
					setCurrent("Маршрутизатор")
					break
				case "./images/switch.png":
					setCurrent("Коммутатор")
					break
				case "./images/hub.png":
					setCurrent("Концентратор")
					break
				case "./images/laptop.png":
					setCurrent("Ноутбук")
					break
				case "./images/printer.png":
					setCurrent("Принтер")
					break
				case "./images/network.png":
					setCurrent("Сеть")
					break
				case "./images/server.png":
					setCurrent("Сервер")
					break
				case "./images/L3.png":
					setCurrent("Коммутатор 3 ур.")
					break
				case "./images/phone.png":
					setCurrent("Телефон")
					break
				default:
					setCurrent("")
			}
		}
		const nameNodesMap = Object.fromEntries(
			nameNodes.map((node) => [node.ip, node.name])
		)
		//Назночение стандартного имени устройства
		const nameNode = nameNodesMap[currentNode?.ip]
		setNameNode(nameNode)
	}, [currentNode])

	const handleClose = () => setShow(false)

	const handleSave = () => {
		if (hardware) {
			// Проверка наличия оборудования и имени
			let newImgUrl = ""
			switch (hardware) {
				case "Компьютер":
					newImgUrl = "./images/pc.png"
					break
				case "Маршрутизатор":
					newImgUrl = "./images/router.png"
					break
				case "Коммутатор":
					newImgUrl = "./images/switch.png"
					break
				case "Концентратор":
					newImgUrl = "./images/hub.png"
					break
				case "Ноутбук":
					newImgUrl = "./images/laptop.png"
					break
				case "Принтер":
					newImgUrl = "./images/printer.png"
					break
				case "Сеть":
					newImgUrl = "./images/network.png"
					break
				case "Сервер":
					newImgUrl = "./images/server.png"
					break
				case "Коммутатор 3 ур.":
					newImgUrl = "./images/L3.png"
					break
				case "Телефон":
					newImgUrl = "./images/phone.png"
					break
				default:
					newImgUrl = ""
			}
			updateNodeImage(newImgUrl)
		}
		updateNodeNameByIp(currentNode?.ip, nameNode)
		setHardware("")
		handleClose()
	}

	const changeHardware = (event) => {
		setHardware(event.target.value)
	}
	const changeNameNode = (event) => {
		setNameNode(event.target.value)
	}
	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Настройка оборудования</Modal.Title>
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
						<option value='Концентратор'>Концентратор</option>
						<option value='Ноутбук'>Ноутбук</option>
						<option value='Принтер'>Принтер</option>
						<option value='Сеть'>Сеть</option>
						<option value='Сервер'>Сервер</option>
						<option value='Коммутатор 3 ур.'>Коммутатор 3 ур.</option>
						<option value='Телефон'>Телефон</option>
					</Form.Select>

					<br />
					<h6 className='modal-block'>Текущее название: </h6>

					{nameNode && (
						<Form.Control
							required
							type='text'
							placeholder='Название'
							value={nameNode}
							onChange={changeNameNode}
						/>
					)}
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
	)
}

export default ModalChange
