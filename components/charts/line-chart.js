const templateLineChart = document.createElement('template');
templateLineChart.innerHTML = `
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

class LineChart extends HTMLElement {

    #uri;
    #param1;
    #param2;

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateLineChart.content.cloneNode(true));
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

    static get observedAttributes() {
        return ['uri', 'param1', 'param2'];
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'uri':
                this.#uri = newValue;
                break;
            case 'param1':
                this.#param1 = newValue;
                break;
            case 'param2':
                this.#param2 = newValue;
                break;
        }
    }


    async renderChart() {

        const data = await this.fetchData();
        const dataSet = new google.visualization.DataTable();
        dataSet.addColumn('string', 'option');
        dataSet.addColumn('number', 'count');

        dataSet.addRows([
            [ 'option1', parseInt(data.option1)],
            [ 'option2', parseInt(data.option2)],
            [ 'option3', parseInt(data.option3)],

        ]);

        const options = {
            title: 'Option Breakdown'
        };

        const chart = new google.visualization.LineChart(this.shadowRoot.querySelector('div'));
        await chart.draw(dataSet, options);
    }

    async fetchData()
    {
        const url = new URL(this.#uri, window.location.origin);
        url.searchParams.set('param1', this.#param1);
        url.searchParams.set('param2', this.#param2);
        const response = await fetch(url.href);
        return  await response.json();
    }
}

customElements.define('line-chart', LineChart);
