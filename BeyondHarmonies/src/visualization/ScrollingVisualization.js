

import { Visualization } from './Visualization'
import { PIXELS_PER_SECOND } from '../Configuration'



const RESOLUTION_SCALAR = 8

export class ScrollingVisualization extends Visualization {
	constructor(name){
		super(name)

		this._swapViz = new Visualization('swap')

	

		this._lastUpdate = performance.now()

		this.round = true
	}

	resize(width, height){
		width *= RESOLUTION_SCALAR
		super.resize(width, height)
		this._swapViz.resize(width, height)
	}

	drawTo(context, x, y){
		if (this.width && this.height){
			const diff = performance.now() - this._lastUpdate
			this._lastUpdate = performance.now()

			const pixels = 10

			this._swapViz.clear()
			this._swapViz.context.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)

			super.clear()
			this._swapViz.context.save()
			this._swapViz.context.translate(this.width - pixels, 0)
			if (diff < 100){
				this.draw(this._swapViz.context, pixels, this.height)
			}
			this._swapViz.context.restore()


			this._context.save()
			this._context.translate(-pixels, 0)
			this._context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
			this._context.restore()


			context.drawImage(this._swapViz.canvas, 0, 0, this.width, this.height, 0, 0, this.width/RESOLUTION_SCALAR, this.height)
		}

	}

	clear(){
		super.clear()
		this._swapViz.clear()
	}
}
