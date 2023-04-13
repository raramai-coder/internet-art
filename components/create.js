class CreateView extends HTMLElement {
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

	get images() {
		return this.getAttribute("data-images");
	}

	set images(val) {
		if (val) {
			this.setAttribute("data-images", val);
		} else {
			this.removeAttribute("data-images");
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
		collageHeader.innerText = "Prompt : " + this.prompt;

		const imageContainer = document.createElement("div");
		imageContainer.setAttribute("class", "image-container");

		let images = parseInt(this.images);
		for (let index = 0; index < images; index++) {
			const image = document.createElement("img");
			image.src = "./Assets/Rectangle 1.png";
			imageContainer.append(image);
		}

		let searchInput = document.createElement("input");
		searchInput.setAttribute("type", "text");
		searchInput.setAttribute("placeholder", "Search");
		searchInput.setAttribute("class", "search-input");

		let submitButton = document.createElement("div");
		submitButton.setAttribute("class", "submit-button");

		detailsContainer.append(collageHeader);
		detailsContainer.append(imageContainer);
		detailsContainer.append(searchInput);
		detailsContainer.append(submitButton);

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

window.customElements.define("create-view", CreateView);
