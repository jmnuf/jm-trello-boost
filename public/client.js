// @ts-check

/**
 * @typedef {import('../src/utils/types/trello').Trello} Trello
 * @typedef {import('../src/utils/types/trello').Trello.PowerUp} PowerUp
 * @typedef {import('../src/utils/types/trello').Trello.PowerUp.IFrame} IFrame
 * @typedef {import('../src/utils/types/trello').Trello.PowerUp.Card} Card
 * @typedef {import('../src/utils/types/trello').Trello.PowerUp.ListSorter} ListSorter
 * @typedef {(t:IFrame, opts:{ cards:Card[] }) => PromiseLike<{ sortedIds:string[] }>} ListSorterCallback
 */

(function() {
	/*
	 * Boost Icon: https://www.svgrepo.com/svg/429319/essential-upload-web-2
	 * Info Icon: https://www.svgrepo.com/svg/429304/essential-information-web
	 * 
	 */
	const BOOST_ICON = "https://www.svgrepo.com/show/429319/essential-upload-web-2.svg";
	const INFO_ICON  = "https://www.svgrepo.com/show/429304/essential-information-web.svg";
	
	/**
	 * 
	 * @param {boolean} asc Is it ascending or descending
	 * @returns {ListSorterCallback}
	 */
	const prioritySorter = (asc) => {
		/**
		 * 
		 * @type {ListSorterCallback}
		 */
		const Sorter = async function(t, { cards }) {
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
				return asc ? toSort.sort((a, b) => a.priority - b.priority) : toSort.sort((a, b) => b.priority - a.priority);
			})();
			// If no priority cards, we aren't sorting the list cause we can't
			if (priorityCards.length == 0) {
				return { sortedIds: [] };
			}
			const sortedPriority = priorityCards.map(c => c.id);
			const unsorted = cards.filter(c => !sortedPriority.includes(c.id)).map(c => c.id);
			const sortedIds = (asc ? sortedPriority : sortedPriority.reverse()).concat(unsorted);
			return { sortedIds };
		}
		return Sorter;
	}

	/**
	 * @type {import('../src/utils/types/trello').Trello.PowerUp}
	 */
	window.TrelloPowerUp.initialize({
		"card-back-section": async (t) => {
			const value = await t.get("card", "shared", "priority", null);
			if (typeof value != "number") {
				throw t.NotHandled();
			}
			return {
				title: "My Back Section",
				icon: BOOST_ICON,
				content: {
					type: "iframe",
					url: t.signUrl("./card-back-section"),
					height: 120,
				},
			};
		},
		"card-badges": async (t) => {
			const value = await t.get("card", "shared", "priority");
			if (typeof value != "number") {
				throw t.NotHandled();
			}
			return [
				{
					title: "Priority",
					icon: INFO_ICON,
					text: "Level " + value,
				}
			];
		},
		"list-sorters": () => {
			/**
			 * @type {ListSorter[]}
			 */
			const sorters = [
				{
					text: "Priority: High to Low",
					callback: prioritySorter(false)
				},
				{
					text: "Priority Low to High",
					callback: prioritySorter(true)
				}
			];
			return sorters;
		},
		"card-buttons": async (t) => {
			const value = await t.get("card", "shared", "priority", null);
			if (typeof value == "number") {
				return [
					{
						text: "Remove priority",
						icon: BOOST_ICON,
						condition: "edit",
						callback: async () => await t.remove("card", "shared", "priority")
					}
				];
			}
			return [
				{
					text: "Add priority",
					icon: BOOST_ICON,
					condition: "edit",
					callback: async () => await t.set("card", "shared", "priority", 5)
				}
			];
		}
	});
})()
