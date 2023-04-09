class CollageView extends HTMLElement {
	get prompt() {
		return this.getAttribute("data-prompt");
	}

	set prompt(val) {
		// Reflect the value of the open property as an HTML attribute.
		if (val) {
			this.setAttribute("data-prompt", val);
		} else {
			this.removeAttribute("data-prompt");
		}
	}

	get creator() {
		return this.getAttribute("data-creator");
	}

	set creator(val) {
		if (val) {
			this.setAttribute("data-creator", val);
		} else {
			this.removeAttribute("data-creator");
		}
	}

	get stars() {
		return this.getAttribute("data-stars");
	}

	set stars(val) {
		if (val) {
			this.setAttribute("data-stars", val);
		} else {
			this.removeAttribute("data-stars");
		}
	}

	get keywordSet() {
		return this.getAttribute("data-keywordset");
	}

	set keywordSet(val) {
		if (val) {
			this.setAttribute("data-keywordset", val);
		} else {
			this.removeAttribute("data-keywordset");
		}
	}

	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: "open" });

		const container = document.createElement("div");
		container.setAttribute("class", "container");

		const collage = document.createElement("div");
		collage.setAttribute("class", "collage");

		const detailsContainer = document.createElement("div");
		detailsContainer.setAttribute("class", "details-container");

		const collageHeader = document.createElement("p");
		collageHeader.setAttribute("class", "collage-header");
		collageHeader.innerText = this.prompt + " by " + this.creator;

		const starContainer = document.createElement("div");
		starContainer.setAttribute("class", "star-container");

		let starsAmount = parseInt(this.stars);
		for (let index = 0; index < starsAmount; index++) {
			const star = document.createElement("img");
			star.src = "./Assets/Polygon 1.png";
			starContainer.append(star);
		}

		let keywordSetContainer = document.createElement("div");
		keywordSetContainer.setAttribute("class", "keyword-set-container");

		let keywords = this.keywordSet.split(";");
		keywords.forEach((element) => {
			const button = document.createElement("div");
			button.setAttribute("class", "keyword-button");
			button.innerText = element;
			keywordSetContainer.append(button);
		});

		let keywordInput = document.createElement("input");
		keywordInput.setAttribute("type", "text");
		keywordInput.setAttribute("placeholder", "Input Keyword");
		keywordInput.setAttribute("class", "keyword-input");

		detailsContainer.append(collageHeader);
		detailsContainer.append(starContainer);
		detailsContainer.append(keywordSetContainer);
		detailsContainer.append(keywordInput);

		container.append(collage);
		container.append(detailsContainer);

		this._shadowRoot.append(container);

		// Apply external styles to the shadow DOM
		const linkElem = document.createElement("link");
		linkElem.setAttribute("rel", "stylesheet");
		linkElem.setAttribute("href", "./style.css");

		// Attach the created elements to the shadow DOM
		this._shadowRoot.appendChild(linkElem);
	}
}

window.customElements.define("collage-view", CollageView);
