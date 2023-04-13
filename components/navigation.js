const navDrawer = document.createElement("nav");
navDrawer.setAttribute("id", "navigation");

const checkbox = document.createElement("input");
checkbox.setAttribute("id", "check");
checkbox.setAttribute("type", "checkbox");

const checklabel = document.createElement("label");
checklabel.setAttribute("class", "burger-button");
checklabel.setAttribute("for", "check");

const icon = document.createElement("span");
icon.setAttribute("class", "material-symbols-outlined");
icon.innerText = "menu";

checklabel.appendChild(icon);

const navContainer = document.createElement("ul");
navContainer.setAttribute("id", "nav-list");

//Attach navigation links
const pages = [
	{ url: "./index.html", name: "Home", id: "home" },
	{ url: "./Blogs/Blogs.html", name: "Blogs", id: "blog" },
	{ url: "./Design/Design.html", name: "Design", id: "design" },
	{ url: "./About.html", name: "About", id: "about" },
	{ url: "./Howitworks.html", name: "How it works", id: "howitworks" },
	{ url: "./Create.html", name: "Create a Collage", id: "create" },
];

pages.forEach((element) => {
	const listItem = document.createElement("li");
	const link = document.createElement("a");

	link.innerText = element.name;

	link.onclick = function () {
		link.href = element.url;
	};

	link.id = element.id;

	listItem.append(link);

	navContainer.append(listItem);
});

navDrawer.append(checkbox);
navDrawer.append(checklabel);
navDrawer.append(navContainer);

class NavDrawer extends HTMLElement {
	constructor() {
		super();
		this._shadowRoot = this.attachShadow({ mode: "open" });
		this._shadowRoot.append(navDrawer);

		// Apply external styles to the shadow DOM
		const linkElem = document.createElement("link");
		linkElem.setAttribute("rel", "stylesheet");
		linkElem.setAttribute("href", "./style.css");

		const linkElem2 = document.createElement("link");
		linkElem2.setAttribute("rel", "stylesheet");
		linkElem2.setAttribute(
			"href",
			"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
		);

		// Attach the created elements to the shadow DOM
		this._shadowRoot.appendChild(linkElem);
		this._shadowRoot.appendChild(linkElem2);
	}
}

window.customElements.define("nav-bar", NavDrawer);
