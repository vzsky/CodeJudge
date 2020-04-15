import { BadRequestException } from "@nestjs/common"

export const ReqError = (msg: string) => {
	throw new BadRequestException({
		status: "failed",
		msg,
	})
}

export const Response = (status: string, msg: any) => {
	return {
		status,
		msg,
	}
}

export interface ResponseType {
	status: string
	msg: any
}
