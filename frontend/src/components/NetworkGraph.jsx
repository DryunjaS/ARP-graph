import React, { useEffect, useState, useCallback } from "react"
import ForceGraph2D from "react-force-graph-2d"
import ModalChange from "./Modal/ModalСhange"

const arpTable = [
	{ ip: "192.168.64.255", mac: "ff-ff-ff-ff-ff-ff", type: "static" },
	{ ip: "224.0.0.22", mac: "01-00-5e-00-00-16", type: "static" },
	{ ip: "224.0.0.251", mac: "01-00-5e-00-00-fb", type: "static" },
	{ ip: "224.0.0.252", mac: "01-00-5e-00-00-fc", type: "static" },
	{ ip: "239.192.152.143", mac: "01-00-5e-40-98-8f", type: "static" },
	{ ip: "239.255.255.250", mac: "01-00-5e-7f-ff-fa", type: "static" },
	{ ip: "239.255.255.250", mac: "ff-ff-ff-ff-ff-ff", type: "static" },
]

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

	const [show, setShow] = useState(false)
	const [currentNode, setCurrentNode] = useState(null)

	useEffect(() => {
		const hierarchicalData = parseArpTable(arpTable)
		setGraphDataNew(hierarchicalData)
	}, [])

	useEffect(() => {
		console.log(graphDataNew)
		const data = createGraphData(graphDataNew)
		setGraphData(data)
	}, [graphDataNew])

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
				// Если есть дочерние узлы, рекурсивно вызываем эту функцию для них
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

	const handleImageChange = (newImageUrl) => {
		updateNodeImage(newImageUrl)
	}

	return (
		<>
			<ModalChange
				show={show}
				setShow={setShow}
				currentNode={currentNode}
				updateNodeImage={handleImageChange}
			/>

			<ForceGraph2D
				graphData={graphData}
				onNodeClick={handleNodeClick}
				nodeLabel={(node) => `IP: ${node.ip}\nMAC: ${node.mac}`}
				nodeCanvasObject={(node, ctx, globalScale) => {
					renderNode(node, ctx, globalScale)
				}}
			/>
		</>
	)
}

export default NetworkGraph
