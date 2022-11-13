import type { Trello } from "./types/trello";

const status = {
	running: false,
};

function startClient() {
	if (!window) return false;

	window.TrelloPowerUp.initialize({
		"card-back-section": (t) => {
			return {
				title: "My Back Section",
				icon: "/favicon.ico",
				content: {
					type: "iframe",
					url: t.signUrl('./card-back-section'),
				},
			} as Trello.PowerUp.CardBackSection
		}
	});

	return true;
}

status.running = startClient();

export default status;

