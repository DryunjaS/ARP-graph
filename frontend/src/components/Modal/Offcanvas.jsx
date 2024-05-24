import React, { useState } from "react"
import Offcanvas from "react-bootstrap/Offcanvas"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function LeftOffcanvas({ show, setShow, setArpTable }) {
	const [textAreaContent, setTextAreaContent] = useState("")
	const [errors, setErrors] = useState({})

	const handleClose = () => setShow(false)

	const handleChange = (event) => {
		const file = event.target.files[0]
		if (file && file.type === "text/plain") {
			const reader = new FileReader()
			reader.onload = (e) => {
				setTextAreaContent(e.target.result)
			}
			reader.onerror = () => {
				setErrors({ file: "Ошибка чтения файла" })
			}
			reader.readAsText(file)
		} else {
			setErrors({ file: "Пожалуйста, выберите текстовый файл" })
		}
	}

	const changeNetwork = () => {
		const regex = /(\d{1,3}(?:\.\d{1,3}){3})\s+([0-9a-fA-F-]+)\s+(\S+)/g

		const matches = [...textAreaContent.matchAll(regex)]

		const arpTable = matches.map((match) => {
			const [, ip, mac, type] = match
			return { ip, mac, type: type === "динамический" ? "dynamic" : "static" }
		})

		setArpTable(arpTable)
		setShow(false) // Закрыть Offcanvas после загрузки файла и изменения сети
	}

	return (
		<>
			<Offcanvas show={show} onHide={handleClose}>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>Загрузите ARP-таблицу</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<Form.Group className='position-relative mb-3'>
						<Form.Label>Файл</Form.Label>
						<Form.Control
							type='file'
							required
							name='file'
							onChange={handleChange}
							isInvalid={!!errors.file}
						/>
						<Form.Control.Feedback type='invalid' tooltip>
							{errors.file}
						</Form.Control.Feedback>
					</Form.Group>
					<Form.Group className='mb-3' controlId='exampleForm.ControlTextarea1'>
						<Form.Label>ARP-таблица</Form.Label>
						<Form.Control
							as='textarea'
							rows={6}
							value={textAreaContent}
							onChange={(e) => setTextAreaContent(e.target.value)}
						/>
					</Form.Group>
					<Button
						variant='primary'
						onClick={changeNetwork}
						className='btn-menu'
					>
						Построить сеть
					</Button>
				</Offcanvas.Body>
			</Offcanvas>
		</>
	)
}

export default LeftOffcanvas
