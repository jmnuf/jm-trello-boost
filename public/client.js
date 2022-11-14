
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
	},
	"list-sorters": (t) => {
		return t.list("name", "id")
			.then(list => {
				console.log("Attempting to sort list:", `${list.name}<${list.id}>`);
				return [
					{
						text: "Priority Asc",
						callback: async function(t, { cards }) {
							const priorityCards = await (async () => {
								const toSort = [];
								for(const c of cards) {
									const id = c.id;
									const priority = await t.get(id, "shared", "priority", null);
									if (priority != null) {
										toSort.push({ id, priority });
									}
								}
								return toSort;
							})();
							// If no priority cards, we aren't sorting the list cause we can't
							if (priorityCards.length == 0) {
								console.log("Can't sort, no priority cards found!")
								return [];
							}
							if (priorityCards.length > 1) {
								priorityCards.sort((a, b) => a.priority - b.priority);
							}
							const sorted = priorityCards.map(c => c.id);
							for(const card of cards) {
								if (sorted.includes(card.id)) continue;
								sorted.push(card.id);
							}
							console.log("priorityCards", priorityCards);
							console.log("sortedCards", sorted);
							return sorted;
						}
					}
				]
			});
	}
});
