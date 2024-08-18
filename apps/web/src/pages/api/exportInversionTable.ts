// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

import { ALL_INVERSION_TABLE } from "@/musictheory/shapes/inversionTable"
import { InversionTableMap } from "@/musictheory/shapes/models/Tables"

type Data = {
	name: string
	payload: InversionTableMap
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	// Set Headers to inform the browser about the type of content
	res.setHeader("Content-Type", "application/json")
	res.setHeader("Content-Disposition", "attachment; filename=data.json")

	// Serialize hashmap and send it as a response
	res.status(200).send({
		name: "All Inversion Table",
		payload: ALL_INVERSION_TABLE,
	})
}
