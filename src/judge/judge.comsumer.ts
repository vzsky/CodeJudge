import { Processor, Process } from "@nestjs/bull"
import { Job } from "bull"
import { exec } from "child_process"
import { JudgeDTO } from "./task.model"

@Processor("judge")
export class JudgeConsumer {
	@Process()
	async judge(job: Job<JudgeDTO>) {
		console.log(job.id)
		try {
			await this.clean()
			await this.compile(job.data)
			console.log("compiled")
		} catch (e) {
			console.log("Judge Failed", e)
		}
		return
	}

	private compile(j: JudgeDTO): Promise<void> {
		return new Promise((resolve, reject) => {
			exec(
				`./judge_script/compiler/${j.lang}.sh ${j.file}`,
				(err, stdout, stderr) => {
					if (err) {
						return reject(err)
					}
					console.log(stdout)
					return resolve()
				}
			)
		})
	}

	private clean(): Promise<void> {
		return new Promise((resolve, reject) => {
			exec(`./judge_script/clean.sh`, (err, stdout, stderr) => {
				if (err) {
					return reject(err)
				}
				return resolve()
			})
		})
	}
}
