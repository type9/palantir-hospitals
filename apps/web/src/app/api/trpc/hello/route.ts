// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"

type Data = {
	name: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	res.status(200).json({ name: "John Doe" })
}

export { handler as GET, handler as POST }
