import { type NextPage } from "next";
import Background from "../components/background";
import HoverCard from "../components/hover-card";

const Home: NextPage = () => {
	return (
		<Background
			pageHead={{
				title:"JM Trello Boost 🚀",
				initTrello: true,
			}}
		>

			<div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
				<div className="font-extrabold leading-normal text-center">
					<h1 className="text-4xl">Small Trello Power Up</h1>
					<h1 className="text-2xl font-extrabold leading-normal">
						built on top of <code>create-<span className="text-purple-300">T3</span>-app</code>
					</h1>
				</div>
				<p className="text-xl">This stack uses:</p>
				<div className="mt-3 grid gap-3 pt-3 text-center md:grid-cols-2 lg:w-2/3">
					<HoverCard
						name="NextJS"
						description="The React framework for production"
						href="https://nextjs.org/"
						linkContents="Documentation"
					/>
					<HoverCard
						name="TypeScript"
						description="Strongly typed programming language that builds on JavaScript, giving you better tooling at any scale"
						href="https://www.typescriptlang.org/"
						linkContents="Documentation"
					/>
					<HoverCard
						name="TailwindCSS"
						description="Rapidly build modern websites without ever leaving your HTML"
						href="https://tailwindcss.com/"
						linkContents="Documentation"
					/>
					<HoverCard
						name="tRPC"
						description="End-to-end typesafe APIs made easy"
						href="https://trpc.io/"
						linkContents="Documentation"
					/>
				</div>
			</div>
		</Background>
	);
};

export default Home;
