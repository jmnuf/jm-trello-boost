import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Background from "../components/background";
import Container from "../components/container";
import Shield from "../components/shield";

const t = globalThis.window?.TrelloPowerUp?.iframe();


export default function CardBackSection() {
	const compId = "JCardBack";
	const priorityState = useState<number|null>(null);
	const priority = priorityState[0];
	const setPriority = async (value:number|null) => await priorityLimiter(value, priorityState[1]);
	if (t) {
		const card = t.card("id", "due");
		card.then(data => {
			const dueDate = new Date(data.due as string);
			console.log({
				id: data.id,
				due: dueDate,
				rawDue: data.due,
			});
		});
		t.get("card", "shared", "priority", priority).then((value:number|null) => {
			if (value != null) {
				t.render(() => t.sizeTo("#" + compId));
			}
			setPriority(value);
		});
	}

	if (priority == null) {
		return (
			<Background 
				pageHead={{
					title:"JmBoost: Card Back Section"
				}}
			>
			</Background>
		)
	}

	const priorityCSS = priority >= 9 ? "text-red-500" : priority > 6 ? "text-amber-600" : priority < 4 ? "text-green-600" : undefined;

	const priorityMessage = priority >= 9 ? "URGENT" : priority > 6 ? "High" : priority >= 4 ? "Normal" : "Low";
	const priorityMessageCSS = priorityCSS ? priorityCSS : undefined;

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
				<div className="flex items-center justify-between mt-2 ml-1">
					<div className="flex flex-col w-full">
						<h2
							className="flex flex-row w-full gap-2 items-center align-middle"
						>
							Priority: <input
								className="w-full"
								style={{ marginBottom: "0px !important;" }}
								type="number"
								min={0}
								max={10}
								name="priority"
								id="priorityInput"
								value={priority}
								onChange={e => setPriority(e.currentTarget.valueAsNumber)}
							/>
						</h2>
						<h3 className="ml-5">Level: <span className={priorityMessageCSS}>{priorityMessage}</span></h3>
					</div>
				</div>
			</Container>
		</Background>
	)
}

const trelloSetPriority = async (value:number|null) => {
	if (t) {
		// While in dev environment don't attempt to set Trello value
		if (globalThis.window?.location.hostname !== "localhost") {
			await t.set("card", "shared", "priority", value);
		}
	}
}

const priorityLimiter = async (value:number|null, setter:Dispatch<SetStateAction<number|null>>) => {
	if (value == null) {
		await trelloSetPriority(value);
		setter(value)
		return;
	}
	if (isNaN(value)) {
		value = 0;
	}
	value = Math.floor(value);
	value = clamp(value, 0, 10);
	await trelloSetPriority(value);
	setter(value);
}

const clamp = (val:number, min:number, max:number) => {
	return Math.min(Math.max(val, min), max);
}
