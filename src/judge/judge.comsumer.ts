import { Processor, Process } from "@nestjs/bull"
import { Job } from "bull"
import { exec } from "child_process"

@Processor("judge")
export class JudgeConsumer {
	@Process()
	async judge(job: Job<unknown>) {
        let file = `job${job.id}`
		exec(`./judge_script/cpp.sh ${file}`, (err, stdout, stderr) => {
			if (err) {
				console.error(err)
				return
			}
			console.log(stdout)
		})
		console.log(job.id)
		return {}
	}
}
