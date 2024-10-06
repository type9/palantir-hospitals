import { NextRequest, NextResponse } from "next/server"

type Data = {
	message: string
}

const handler = async (req: NextRequest): Promise<NextResponse<Data>> => {
	return NextResponse.json({ message: "Hello, Next.js!" })
}

export { handler as GET, handler as POST }
