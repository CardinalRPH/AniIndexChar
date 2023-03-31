class ResultContent extends HTMLElement {
    connectedCallback() {
        this.src = this.getAttribute('src') || null;
        this.charname = this.getAttribute('charname') || null;

        this.innerHTML = `
        <div class="content-result d-flex flex-column col-sm-auto mx-2 my-2 p-0 rounded" data-bs-toggle="modal" title="${this.charname}"
                            data-bs-target="#exampleModalCenter">
                            <div class="img-content position-relative">
                                <div
                                    class="content-title d-flex flex-column justify-content-end h-100 w-100 position-absolute">
                                    <div class="content-text m-2">
                                        <h3 class="text-truncate">
                                            ${this.charname}
                                        </h3>
                                    </div>
                                </div>
                                <img src="${this.src}" alt="" width="250"
                                    height="300" class="img-main">
                            </div>
                        </div>
        `;
    }
}

customElements.define('result-content', ResultContent);