import type { Dispatch, ReactNode, SetStateAction } from "react";
import React, { useState } from "react";
import Background from "../components/html/background";
import Container from "../components/html/container";
import type { Trello } from "../utils/types/trello";

const t = globalThis.window?.TrelloPowerUp?.iframe();


export default function CardBackSection() {
	const compId = "JCardBack";
	const priorityState = useState<number|null>(null);
	const priority = priorityState[0];
	const setPriority = async (value:number|null) => await priorityLimiter(value, priorityState[1]);
	
	if (t) {
		trelloGetPriority().then(async value => {
			if (typeof value == "number") {
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
				No available priority
			</Background>
		)
	}

	const priorityCSS = priority >= 9 ? "text-red-500" : priority > 6 ? "text-amber-600" : priority < 4 ? "text-green-600" : "";

	const priorityMessage = priority >= 9 ? "URGENT" : priority > 6 ? "High" : priority >= 4 ? "Normal" : "Low";

	const canUserEdit = trelloCanUserEdit();

	return (
		<Background
			pageHead={{
				title: "JmBoost: Card Back Section"
			}}
		>
			<Container id={compId}>
				<div className="flex items-center justify-between mt-2 ml-1">
					<Column>
						<Column>
							<h2
								className="flex flex-row w-full gap-2 items-center align-middle"
							>
								<PriorityValueDisplay
									css={priorityCSS}
									canUserEdit={canUserEdit}
									priority={priority}
									setPriority={setPriority}
								/>
							</h2>
							<h3 className="ml-5">Level: <span className={priorityCSS}>{priorityMessage}</span></h3>
						</Column>
					</Column>
				</div>
			</Container>
		</Background>
	)
}

const Column:React.FC<{ children:ReactNode }> = ({ children }) => {
	return <div className="flex flex-col w-full">{ children }</div>
}

const PriorityValueDisplay:React.FC<{
	canUserEdit:boolean,
	css:string,
	priority:number,
	setPriority:(v:number|null)=>Promise<void>
}> = ({ canUserEdit, priority, setPriority, css }) => {
	let value;
	if (!canUserEdit) {
		value = <span className={css}>{priority}</span>
	} else {
		value = <input 
		className="w-52"
		// To center item properly since Trello forces me with a 12px bottom margin and I can't be bothered to write my own css class for this
		style={{ marginTop: "12px" }}
		type="number"
		// Limits
		min={0} max={10}
		// Value editing!
		value={priority}
		onChange={e => setPriority(e.currentTarget.valueAsNumber)}
	/>
	}
	return <>
		Priority: {value}
	</>
}

type DoTrelloCallback<T> = (t:Trello.PowerUp.IFrame) => T;

const doTrelloSync = function<T>(cb:DoTrelloCallback<T>, def:T) {
	if (t) {
		if (globalThis.window?.location.hostname !== "localhost") {
			return cb(t);
		}
	}
	return def;
}

const doTrello = async function<T=void>(cb:DoTrelloCallback<PromiseLike<T>>, def:T):Promise<T> {
	return doTrelloSync(cb, def as PromiseLike<T>);
}

const trelloSet = async function<T>(visibility:Trello.PowerUp.Visibility, key:string, value:T) {
	await doTrello(async t => {
		await t.set("card", visibility, key, value);
	}, undefined)
}

const trelloGet = async function<T,V=null>(visibility:Trello.PowerUp.Visibility, key:string, defValue:T, trelloDef:V):Promise<T|V> {
	return doTrello(async t => {
		return await t.get("card", visibility, key, trelloDef);
	}, defValue);
}

const trelloSetPriority = async (value:number|null) => {
	await trelloSet("shared", "priority", value);
}

const trelloGetPriority = async () => {
	return await trelloGet("shared", "priority", "5" as unknown as number, null);
}

const trelloCanUserEdit = () => {
	return doTrelloSync(t => {
		const signedIn = t.isMemberSignedIn();
		const { permissions } = t.getContext();
		if (!signedIn) {
			return false;
		}
		if (!permissions) {
			return false;
		}
		return permissions.card == "write";
	}, true);
}


const priorityLimiter = async (value:number|null, setter:Dispatch<SetStateAction<number|null>>) => {
	if (value == null) {
		await trelloSetPriority(value);
		setter(value)
		return;
	}
	if (isNaN(value)) {
		value = 1;
	}
	value = Math.floor(value);
	value = clamp(value, 1, 10);
	await trelloSetPriority(value);
	setter(value);
}

const clamp = (val:number, min:number, max:number) => {
	return Math.min(Math.max(val, min), max);
}
