import type { ReactNode } from "react";
import { useState } from "react";
import type { z, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import type { Trello } from "./types/trello";

type IFrame = Trello.PowerUp.IFrame;
type IFrameOptions = Trello.PowerUp.IFrameOptions;
type Scope = Trello.PowerUp.Scope;
type Visibility = Trello.PowerUp.Visibility;

type WithTrelloCallback<T> = (t:Trello.PowerUp.IFrame) => T;

let t:IFrame;

const notInProduction = () => {
	return process?.env?.NODE_ENV !== "production" || globalThis.window?.location.hostname !== "localhost";
}

export function useTrelloPowerUp(options?:IFrameOptions):[IFrame|null, Record<string, unknown>|undefined] {
	const [trello, setTrello] = useState<IFrame>();
	const [data, setData] = useState<Record<string, unknown>>();
	if (trello) {
		t = trello;
		return [t, data];
	}
	if (notInProduction()) {
		if (data == null) {
			setData({ });
		}
		return [null, data];
	}
	if (globalThis.window && window.TrelloPowerUp) {
		const iframe = window.TrelloPowerUp.iframe(options);
		t = Object.assign({ nextTrelloIFrame: true }, iframe);
		setTrello(t);
	}
	if (!t) {
		if (data == null) {
			setData({ });
		}
	}
	return [null, data];
}

export function withTrelloSync<T>(cb:WithTrelloCallback<T>, defReturn?:T) {
	if (t) {
		return cb(t);
	}
	return defReturn;
}

export async function withTrello<T>(cb:WithTrelloCallback<Promise<T>>, defReturn?:T) {
	return await withTrelloSync(cb, Promise.resolve(defReturn));
}

export async function doSharedSet(scope:Scope, key:string, value:unknown) {
	await withTrello(async t => {
		return await t.set(scope, "shared", key, value);
	});
}

export async function doSharedGet<T>(scope:Scope, key:string, defVal?:T) {
	return await withTrello(async t => {
		return await t.get(scope, "shared", key, defVal);
	}, defVal);
}

export function useWrappedTrello<T extends ZodRawShape>(schema:ZodObject<T, "strip", ZodTypeAny>, options?:IFrameOptions) {
	const [trello] = useTrelloPowerUp(options);
	const [wrapped] = useState(new WrappedTrello<T>(schema, trello as IFrame));
	if (!trello) {
		return null;
	}
	
	return wrapped;
}

type PowerUpPageProps = { children?:ReactNode, className?:string, options?:IFrameOptions };

export function PowerUpPage({ children, className, options }:PowerUpPageProps) {
	useTrelloPowerUp(options);
	return <div className={className}>
		{children}
	</div>
}

type WrappedTrelloPropertyOperations<T> = {
	get(): Promise<T|undefined>;
	get(def:T): Promise<T>;
	set(value:T): Promise<void>;
}
type WrappedTrelloPropertiesOperations<T extends ZodObject<ZodRawShape, "strip", ZodTypeAny>> = {
	[k in keyof z.infer<T>]-?: WrappedTrelloPropertyOperations<Exclude<z.infer<T>[k], undefined>>
}
type WrappedTrelloVisibilityOperations<T extends ZodObject<ZodRawShape, "strip", ZodTypeAny>> = {
	[v in Visibility]: WrappedTrelloPropertiesOperations<T>
}
type WrappedTrelloOperations<T extends ZodObject<ZodRawShape, "strip", ZodTypeAny>> = {
	[s in Scope]: WrappedTrelloVisibilityOperations<T>
}

class WrappedTrello<T extends ZodRawShape> {
	t:IFrame;
	private _schema:ZodObject<T, "strip", ZodTypeAny>;
	private _operations:WrappedTrelloOperations<typeof this._schema>;

	constructor(schema:ZodObject<T, "strip", ZodTypeAny>, t:IFrame) {
		this._schema = schema;
		this.t = t;
		this._operations = this._generateOperations();
	}

	private _generateOperations():WrappedTrelloOperations<typeof this._schema> {
		type SCHEMA = typeof this._schema;

		const scopes = [ "member", "card", "board", "organization" ] as const;
		const visibilities = [ "private", "shared" ] as const;
		const keys = Object.keys(this._schema.shape);
		const operations:Partial<WrappedTrelloOperations<SCHEMA>> = {};
		for(const scope of scopes) {
			operations[scope] = visibilities.reduce<WrappedTrelloVisibilityOperations<SCHEMA>>((obj, visibility) => {
				obj[visibility] = keys.reduce<WrappedTrelloPropertiesOperations<SCHEMA>>((obj, key) => {
					obj[key as keyof z.infer<SCHEMA>] = {
						set: async (value: unknown) => {
							await this.t.set(scope, visibility, key, value);
						},
						get: async (def:unknown=undefined) => {
							const saved = await this.t.get(scope, visibility, key, def);
							return saved;
						}
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					} as unknown as WrappedTrelloPropertyOperations<any>;
					return obj;
				}, {} as unknown as WrappedTrelloPropertiesOperations<SCHEMA>);
				return obj;
			}, {} as unknown as WrappedTrelloVisibilityOperations<SCHEMA>);
		}
		return operations as WrappedTrelloOperations<SCHEMA>;
	}

	get member() {
		return this._operations.member;
	}
	get card() {
		return this._operations.card;
	}
	get board() {
		return this._operations.board;
	}
	get organization() {
		return this._operations.organization;
	}
}
