import Background from "../components/background";
import Shield from "../components/shield";


export default function cardBackSection() {
	return (
		<Background
			pageHead={{
				title: 'JmBoost: Card Back Section'
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
