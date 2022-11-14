
/**
 * @type {import('../src/utils/types/trello').Trello.PowerUp}
 */
window.TrelloPowerUp.initialize({
	"card-back-section": (t) => {
		return {
			title: "My Back Section",
			icon: "https://img.shields.io/badge/jm-priority-blueviolet?style=plastic",
			content: {
				type: "iframe",
				url: t.signUrl("./card-back-section"),
				height: 180,
			},
		};
	},
	"card-badges": (t) => {
		return t.get("card", "shared", "priority").then(value => {
			if (typeof value != "number") {
				throw t.NotHandled();
			}
			return [
				{
					title: "Priority",
					icon: "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg",
					// icon: "https://img.shields.io/badge/priority-" + String(value) + "-blueviolet?style=social",
					text: "Level " + value,
				}
			]
		})
	}
});
