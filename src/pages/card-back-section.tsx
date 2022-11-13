import Background from "../components/background";
import Shield from "../components/shield";

const t = globalThis.window?.TrelloPowerUp?.iframe();

export default function cardBackSection() {
	const card = t?.card("id");
	card?.then(console.log);
	return (
		<Background
			pageHead={{
				title: "JmBoost: Card Back Section"
			}}
		>
			<Shield
				type="raw"
				url="https://img.shields.io/github/last-commit/jmnuf/jm-trello-boost/main?"
				label="Last GitHub commit"
				style="plastic"
			/>
		</Background>
	)
}
