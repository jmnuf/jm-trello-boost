(function() {
	
	const prioritySorter = (asc) => {
		return async function(t, { cards }) {
			const priorityCards = await (async () => {
				/** @type {{id:string, priority:number}[]} */
				const toSort = [];
				for(const c of cards) {
					const id = c.id;
					const priority = await t.get(id, "shared", "priority", null);
					if (priority != null) {
						toSort.push({ id, priority });
					}
				}
				return toSort.sort((a, b) => a.priority - b.priority);
			})();
			// If no priority cards, we aren't sorting the list cause we can't
			if (priorityCards.length == 0) {
				return { sortedIds: priorityCards };
			}
			const sortedPriority = priorityCards.map(c => c.id);
			const unsorted = cards.filter(c => !sortedPriority.includes(c.id)).map(c => c.id);
			const sortedIds = sortedPriority.concat(unsorted);
			return { sortedIds: asc ? sortedIds : sortedIds.reverse() };
		}
	}

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
					height: 0,
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
		"list-sorters": () => {
			return [
				{
					text: "Priority asc",
					callback: prioritySorter(true)
				},
				{
					text: "Priority dsc",
					callback: prioritySorter(false)
				}
			];
		},
		"card-buttons": (t) => {
			return t.get("card", "shared", "priority", null)
				.then(value => {
					if (typeof value == "number") {
						throw t.NotHandled();
					}
					return [
						{
							text: "Add priority",
							icon: "https://cdn.glitch.me/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg",
							condition: "edit",
							callback: async () => await t.set("card", "shared", "priority", 5)
						}
					]
			});
		}
	});
})()
