import type { ReactNode } from "react";

export default function Container({ children }:{ children:ReactNode }) {
	return (
		<div className="container flex flex-col mx-auto p-1">
			{children}
		</div>
	)
}
