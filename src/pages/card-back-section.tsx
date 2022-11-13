import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Background from "../components/background";
import Container from "../components/container";
import Shield from "../components/shield";

const t = globalThis.window?.TrelloPowerUp?.iframe();

export default function CardBackSection() {
	const priorityState = useState(5);
	const priority = priorityState[0];
	const setPriority = (value:number) => priorityLimiter(value, priorityState[1]);
	if (t) {
		const card = t.card("id");
		card.then(console.log);
		t.render(() => t.sizeTo("#JCardBack"));
		t.get("card", "shared", "priority", priority).then(setPriority);
	}
	return (
		<Background
			pageHead={{
				title: "JmBoost: Card Back Section"
			}}
		>
			<Container id="JCardback">
				<Shield
					type="raw"
					url="https://img.shields.io/github/last-commit/jmnuf/jm-trello-boost/main?"
					label="last project update"
					style="plastic"
				/>
				<h2>Priority: {priority}</h2>
				<input type="button" value="increase" onClick={() => setPriority(priority + 1)} />
				<input type="button" value="decrease" onClick={() => setPriority(priority - 1)} />
			</Container>
		</Background>
	)
}

const priorityLimiter = (value:number, setter:Dispatch<SetStateAction<number>>) => {
	value = Math.floor(value);
	value = Math.max(value,  0);
	value = Math.min(value, 10);
	if (t) {
		t.set("card", "shared", "priority", value);
	}
	setter(value);
}
