"use client"

import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "./components/main-nav"
import { Overview } from "./components/overview"
import { RecentSales } from "./components/recent-sales"
import { tabContent } from "./content"

export default function DashboardPage() {
	return (
		<>
			<div className="md:hidden">
				<Image
					src="/examples/dashboard-light.png"
					width={1280}
					height={866}
					alt="Dashboard"
					className="block dark:hidden"
				/>
				<Image
					src="/examples/dashboard-dark.png"
					width={1280}
					height={866}
					alt="Dashboard"
					className="hidden dark:block"
				/>
			</div>
			<div className="hidden flex-col md:flex">
				<div className="border-b"></div>
				<div className="flex-1 space-y-4 p-8 pt-6">
					<div className="flex items-center justify-between space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							Dashboard
						</h2>
						<div className="flex items-center space-x-2"></div>
					</div>
					<Tabs defaultValue={"overview"} className="space-y-4">
						<TabsList>
							{tabContent.map((tab) => (
								<TabsTrigger key={tab.id} value={tab.id}>
									{tab.id.charAt(0).toUpperCase() +
										tab.id.slice(1).replace("-", " ")}
								</TabsTrigger>
							))}
						</TabsList>
						{tabContent.map((tab) => (
							<TabsContent
								className="space-y-4"
								key={tab.id}
								value={tab.id}
							>
								{tab.content && <tab.content />}
							</TabsContent>
						))}
					</Tabs>
				</div>
			</div>
		</>
	)
}
