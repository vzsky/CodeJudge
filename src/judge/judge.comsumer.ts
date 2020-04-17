import { Processor, Process } from "@nestjs/bull"
import { Job } from "bull"
import { exec } from "child_process"
import { JudgeDTO } from "./task.model"
import { JudgeService } from "./judge.service"
import { UserService } from "src/user/user.service"

@Processor("judge")
export class JudgeConsumer {
	constructor(
		private readonly judgeService: JudgeService,
		private readonly userService: UserService
	) {}

	@Process()
	async judge(job: Job<JudgeDTO>) {
		console.log(job.id)
		try {
			await this.clean()
			await this.compile(job.data)
			console.log("compiled")
			let Results = this.runAll(job.data)
			Results.then((results) => {
				let save = results.map((val) => {
					if (val === "Same") return "P"
					if (val === "Diff") return "-"
					return "?"
				})
				console.log(save)
				this.userService.addResult(job.data.uid, job.data.tid, save)
			})
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

	private runCase(lang: string, tid: string, c: number): Promise<string> {
		return new Promise((resolve, reject) => {
			exec(
				`./judge_script/runner/${lang}.sh ./tasks/${tid}/Testcases ${c}`,
				(err, stdout, stderr) => {
					if (err) {
						console.log(err)
						return resolve("Diff")
					}
					if (stdout) return resolve("How?")
					return resolve("Same")
				}
			)
		})
	}

	private async runAll(j: JudgeDTO): Promise<string[]> {
		const task = await this.judgeService.findTaskByTid(j.tid)
		if (this.judgeService.isResponseType(task)) throw "No such task"
		let cases = task.cases
		let Res = []
		console.log(cases, "cases are running")
		return new Promise((resolve, reject) => {
			for (let c = 1; c <= cases; c++) {
				Res.push(this.runCase(j.lang, j.tid, c))
			}
			Promise.all(Res).then((res) => resolve(res))
		})
	}
}
