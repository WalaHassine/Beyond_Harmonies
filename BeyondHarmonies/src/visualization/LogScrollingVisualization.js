
import { Visualization } from './Visualization'
import { ScrollingVisualization } from './ScrollingVisualization'

export class LogScrollingVisualization extends Visualization {
	constructor(name){
		super(name)

		this._scrollMultiple = 4

		this._scrollCanvas = new ScrollingVisualization('swap')
	}

	resize(width, height){
		super.resize(width, height)
		this._scrollCanvas.resize(width, height)
	}

	drawTo(context, x, y){
		if (this.width && this.height){
			this._scrollCanvas.drawTo(context, 0, 0)

		
		}

	}
}
