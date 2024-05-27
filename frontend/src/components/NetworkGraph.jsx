import React, { useEffect, useState, useCallback } from "react"
import ForceGraph2D from "react-force-graph-2d"
import ModalChange from "./Modal/ModalСhange"
import ModalDelete from "./Modal/ModalDelete"
import LeftOffcanvas from "../components/Modal/Offcanvas"
import Button from "react-bootstrap/Button"

const parseArpTable = (arpTable) => {
	const root = {
		ip: arpTable[0].ip,
		mac: arpTable[0].mac,
		imgUrl: "/images/pc.png",
		children: [],
	}

	const subnetMap = new Map()

	const getSubnet = (ip) => {
		const octets = ip.split(".")
		return `${octets[0]}.${octets[1]}.${octets[2]}`
	}

	arpTable.slice(1).forEach((entry) => {
		const subnet = getSubnet(entry.ip)

		if (!subnetMap.has(subnet)) {
			subnetMap.set(subnet, {
				ip: `${subnet}.x`,
				mac: "switch-mac",
				imgUrl: "/images/switch.png",
				children: [],
			})
		}

		subnetMap.get(subnet).children.push({
			...entry,
			imgUrl: "/images/pc.png",
		})
	})

	root.children = Array.from(subnetMap.values())

	return [root]
}

const createGraphData = (graphDataNew) => {
	let nodes = []
	let links = []

	const addNodeAndLinks = (entry, parentId = null, depth = 0) => {
		const nodeId = nodes.length

		nodes.push({
			id: nodeId,
			ip: entry.ip,
			mac: entry.mac,
			imgUrl: entry.imgUrl,
			depth: depth,
		})

		if (parentId !== null) {
			links.push({
				source: parentId,
				target: nodeId,
			})
		}

		if (entry.children) {
			entry.children.forEach((child) =>
				addNodeAndLinks(child, nodeId, depth + 1)
			)
		}
	}

	graphDataNew.forEach((entry) => addNodeAndLinks(entry))

	return { nodes, links }
}

const NetworkGraph = () => {
	const [graphData, setGraphData] = useState({ nodes: [], links: [] })
	const [graphDataNew, setGraphDataNew] = useState([])
	const [nameNodes, setNameNodes] = useState([])

	const [arpTable, setArpTable] = useState([
		{ ip: "192.168.64.255", mac: "ff-ff-ff-ff-ff-ff", type: "static" },
		{ ip: "224.0.0.22", mac: "01-00-5e-00-00-16", type: "static" },
		{ ip: "224.0.0.251", mac: "01-00-5e-00-00-fb", type: "static" },
		{ ip: "224.0.0.252", mac: "01-00-5e-00-00-fc", type: "static" },
		{ ip: "239.192.152.143", mac: "01-00-5e-40-98-8f", type: "static" },
		{ ip: "239.255.255.250", mac: "01-00-5e-7f-ff-fa", type: "static" },
		{ ip: "239.255.255.252", mac: "ff-ff-ff-ff-ff-ff", type: "static" },
	])

	const [show, setShow] = useState(false)
	const [showDelete, setShowDelete] = useState(false)
	const [showOffcan, setShowOffcan] = useState(false)

	const [currentNode, setCurrentNode] = useState(null)

	useEffect(() => {
		if (arpTable.length > 0) {
			const hierarchicalData = parseArpTable(arpTable)
			setGraphDataNew(hierarchicalData)
		}
	}, [arpTable])

	//---Получение массива имен------
	const traverseTree = (node, nodesMap, nameCount) => {
		if (node.imgUrl) {
			const fileName = node.imgUrl.split("/").pop().split(".")[0]
			const capitalizedFileName =
				fileName.length === 2
					? fileName.toUpperCase()
					: fileName.charAt(0).toUpperCase() + fileName.slice(1)

			if (node.ip) {
				if (!nameCount[capitalizedFileName]) {
					nameCount[capitalizedFileName] = 1
				} else {
					nameCount[capitalizedFileName]++
				}
				const uniqueName = `${capitalizedFileName}${nameCount[capitalizedFileName]}`

				nodesMap[node.ip] = { ip: node.ip, name: uniqueName }
			}
		}

		if (node.children && Array.isArray(node.children)) {
			node.children.forEach((childNode) =>
				traverseTree(childNode, nodesMap, nameCount)
			)
		}
	}

	useEffect(() => {
		if (graphDataNew.length > 0) {
			const data = createGraphData(graphDataNew)
			setGraphData(data)
		}

		const nodesMap = {}
		const nameCount = {}
		graphDataNew.forEach((node) => traverseTree(node, nodesMap, nameCount))
		setNameNodes(Object.values(nodesMap))
	}, [graphDataNew])
	useEffect(() => {
		console.log(nameNodes)
	}, [nameNodes])
	const loadImage = useCallback((src) => {
		return new Promise((resolve, reject) => {
			const img = new Image()
			img.src = src
			img.onload = () => resolve(img)
			img.onerror = (err) => reject(err)
		})
	}, [])

	const renderNode = useCallback(
		async (node, ctx, globalScale) => {
			if (!node.img || node.imgUrl !== node.loadedImgUrl) {
				try {
					node.img = await loadImage(node.imgUrl)
					node.loadedImgUrl = node.imgUrl
				} catch (err) {
					console.error(`Failed to load image: ${node.imgUrl}`, err)
					return
				}
			}
			const size = 48 / globalScale
			ctx.drawImage(node.img, node.x - size / 2, node.y - size / 2, size, size)
		},
		[loadImage]
	)

	const handleNodeClick = (node) => {
		setCurrentNode(node)
		setShow(true)
	}

	const handleNodeRightClick = (node) => {
		setCurrentNode(node)
		setShowDelete(true)
	}

	const updateNodeImage = (newImageUrl) => {
		const updatedGraphData = updateNodeImageRecursively(
			graphDataNew,
			currentNode.ip,
			newImageUrl
		)
		setGraphDataNew(updatedGraphData)
	}

	const updateNodeImageRecursively = (data, nodeIp, newImageUrl) => {
		return data.map((entry) => {
			if (entry.ip === nodeIp) {
				return {
					...entry,
					imgUrl: newImageUrl,
				}
			} else if (entry.children && entry.children.length > 0) {
				return {
					...entry,
					children: updateNodeImageRecursively(
						entry.children,
						nodeIp,
						newImageUrl
					),
				}
			}
			return entry
		})
	}
	const updateNodeNameByIp = (ip, newName) => {
		setNameNodes((prevNameNodes) => {
			const updatedNameNodes = [...prevNameNodes]

			const nodeIndex = updatedNameNodes.findIndex((node) => node.ip === ip)

			if (nodeIndex !== -1) {
				updatedNameNodes[nodeIndex] = {
					...updatedNameNodes[nodeIndex],
					name: newName,
				}
			}

			return updatedNameNodes
		})
	}

	const handleDeleteNode = (node) => {
		const updatedGraphData = deleteNodeAndReassignChildren(
			graphDataNew,
			node.ip
		)
		setGraphDataNew(updatedGraphData)
	}

	const deleteNodeAndReassignChildren = (data, nodeIp) => {
		const traverse = (entries, parent = null) => {
			return entries
				.map((entry) => {
					if (entry.ip === nodeIp) {
						if (parent) {
							parent.children = parent.children.concat(entry.children || [])
						}
						return null
					}
					if (entry.children) {
						entry.children = traverse(entry.children, entry)
					}
					return entry
				})
				.filter((entry) => entry !== null)
		}
		return traverse(data)
	}

	const handleImageChange = (newImageUrl) => {
		updateNodeImage(newImageUrl)
	}

	// Создаем объект для быстрого поиска названий узлов по IP
	const nameNodesMap = Object.fromEntries(
		nameNodes.map((node) => [node.ip, node.name])
	)

	return (
		<>
			<ModalChange
				show={show}
				setShow={setShow}
				currentNode={currentNode}
				updateNodeImage={handleImageChange}
				nameNodes={nameNodes}
				updateNodeNameByIp={updateNodeNameByIp}
			/>
			<ModalDelete
				show={showDelete}
				setShow={setShowDelete}
				currentNode={currentNode}
				onDelete={handleDeleteNode}
			/>
			<Button
				variant='primary'
				onClick={() => setShowOffcan(true)}
				id='btn-menu'
			>
				Меню
			</Button>
			<LeftOffcanvas
				show={showOffcan}
				setShow={setShowOffcan}
				setArpTable={setArpTable}
			/>
			<ForceGraph2D
				graphData={graphData}
				onNodeClick={handleNodeClick}
				onNodeRightClick={handleNodeRightClick}
				nodeCanvasObject={(node, ctx, globalScale) => {
					renderNode(node, ctx, globalScale)
					const nodeName = nameNodesMap[node.ip] || ""
					const fontSize = 12 / globalScale
					ctx.font = `${fontSize}px Arial`
					ctx.textAlign = "center"
					ctx.textBaseline = "middle"
					ctx.fillStyle = "black"
					ctx.fillText(nodeName, node.x, node.y + 13)
				}}
				linkDirectionalParticles={1}
				nodeLabel={(node) => `IP: ${node.ip}\nMAC: ${node.mac}`}
			/>
		</>
	)
}

export default NetworkGraph
