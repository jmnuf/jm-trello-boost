import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Background from "../components/background";
import Container from "../components/container";
import Shield from "../components/shield";

const t = globalThis.window?.TrelloPowerUp?.iframe();

export default function CardBackSection() {
	const compId = "JCardBack";
	const priorityState = useState(5);
	const priority = priorityState[0];
	const setPriority = async (value:number) => await priorityLimiter(value, priorityState[1]);
	if (t) {
		const card = t.card("id", "due");
		card.then(console.log);
		t.render(() => t.sizeTo("#" + compId));
		t.get("card", "shared", "priority", priority).then(setPriority);
	}
	const buttonBorderCSS = "border border-solid border-violet-300 hover:border hover:border-solid hover:border-violet-300 focus:border focus:border-solid focus:border-violet-300"
	const buttonBGClrsCSS = "bg-slate-100 hover:bg-slate-200"
	const buttonCSS = `${buttonBorderCSS} ${buttonBGClrsCSS}`;

	const priorityCSS = priority > 6 ? "text-red-500" : priority < 4 ? "text-green-600" : undefined;
	return (
		<Background
			pageHead={{
				title: "JmBoost: Card Back Section"
			}}
		>
			<Container id={compId}>
				<Shield
					type="raw"
					url="https://img.shields.io/github/last-commit/jmnuf/jm-trello-boost/main?"
					label="last project update"
					style="plastic"
				/>
				<div className="flex items-center justify-between">
					<h2>Priority: <span className={priorityCSS}>{priority}</span></h2>
					<div className="flex flex-col">
						<button className={buttonCSS} onClick={() => setPriority(priority + 1)}>&#43;</button>
						<button className={buttonCSS} onClick={() => setPriority(priority - 1)}>&#45;</button>
					</div>
				</div>
			</Container>
		</Background>
	)
}

const priorityLimiter = async (value:number, setter:Dispatch<SetStateAction<number>>) => {
	value = Math.floor(value);
	value = clamp(value, 0, 10);
	if (t) {
		await t.set("card", "shared", "priority", value);
	}
	setter(value);
}

const clamp = (val:number, min:number, max:number) => {
	return Math.min(Math.max(val, min), max);
}
