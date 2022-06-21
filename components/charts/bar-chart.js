const templateBarChart = document.createElement('template');
templateBarChart.innerHTML = `
<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
</style>
<div></div>
`;

class BarChart extends HTMLElement {

    #uri;
    #param1;
    #param2;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateComboChart.content.cloneNode(true));
    }

    async connectedCallback() {
        document.addEventListener('params-changed', e => {
            this.setAttribute('param1', e.detail.param1);
            this.setAttribute('param2', e.detail.param2);
            this.renderChart();
        });
        await google.charts.load('current', {'packages':['corechart']});
        await this.renderChart();
    }

    // A getter/setter for an open property.
    get open() {
        return this.hasAttribute('open');
    }

    set open(val) {
        // Reflect the value of the open property as an HTML attribute.
        if (val) {
            this.setAttribute('open', '');
        } else {
            this.removeAttribute('open');
        }
        this.toggleDrawer();
    }

    // A getter/setter for a disabled property.
    get disabled() {
        return this.hasAttribute('disabled');
    }

    set disabled(val) {
        // Reflect the value of the disabled property as an HTML attribute.
        if (val) {
            this.setAttribute('disabled', '');
        } else {
            this.removeAttribute('disabled');
        }
    }

    // Can define constructor arguments if you wish.
    constructor() {
        // If you define a constructor, always call super() first!
        // This is specific to CE and required by the spec.
        super();

        // Setup a click listener on <bar-chart> itself.
        this.addEventListener('click', e => {
            // Don't toggle the drawer if it's disabled.
            if (this.disabled) {
                return;
            }
            this.toggleDrawer();
        });
    }

    toggleDrawer() {

    }
}

customElements.define('bar-chart', BarChart);